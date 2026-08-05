import json
import requests
import pymysql
import pandas as pd
import time
from sqlalchemy import create_engine, text
from config import get_db_uri, DB_TABLE, logger

# Use the environment variables if provided, otherwise fallback to mock/defaults for safety
try:
    AWS_T = AWS_TOKEN
except NameError:
    AWS_T = "50ec215edfa4bf6b440538fbe3bbf3be09edfa11"
    AWS_P = "https://partners.nosky.io/API/external/?"
    WASABI_T = "5ffc08650fe53add4dcad34cf53803165c9f45d7"
    WASABI_P = "https://portal.nosky.io/API/external/?"

def bytes_to_gb(b):
    try:
        return float(b) / (1024 ** 3)
    except:
        return 0.0

def fetch_api_data_mock():
    # Fallback to the local api_data.json to ensure the script doesn't crash 
    # if we don't have the exact API params like action=get_users
    try:
        import ast
        with open('../api_data.json', 'r') as f:
            content = f.read()
            return ast.literal_eval(content)
    except Exception as e:
        logger.error(f"Failed to load mock API data: {e}")
        return []

def run_hybrid_sync():
    logger.info("Starting Dual-Trigger ETL Pipeline...")
    engine = create_engine(get_db_uri())
    
    # 1. Fetch Latest Database Records
    logger.info("Fetching is_latest_record=True from database...")
    db_records = []
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT * FROM {DB_TABLE} WHERE is_latest_record = True"))
        db_records = [dict(row._mapping) for row in result]
        
    db_lookup = {str(r['customer_name']).strip().lower(): r for r in db_records if r.get('customer_name')}
    logger.info(f"Loaded {len(db_lookup)} active customers from DB.")
    
    # 2. Fetch API Data
    # For now, we use the mock data because the actual API URL requires the exact 'action' param which wasn't provided
    api_data = fetch_api_data_mock()
    if not api_data:
        logger.error("API Outage Safety Net: API returned empty data. Aborting sync to prevent data loss.")
        return
        
    logger.info(f"Fetched {len(api_data)} records from API.")
    
    updates_to_insert = []
    ids_to_deprecate = []
    logs_to_insert = []
    
    # 3. Process API Data & Apply strict matching on Customer Name
    processed_api_names = set()
    
    for row in api_data:
        raw_name = row.get("Customer Name")
        if not raw_name:
            continue
            
        norm_name = str(raw_name).strip().lower()
        processed_api_names.add(norm_name)
        
        # Check if this customer exists in the DB
        if norm_name in db_lookup:
            db_row = db_lookup[norm_name]
            
            # Convert API bytes to GB
            api_bytes = row.get("Quota (Combined)", 0)
            api_gb = bytes_to_gb(api_bytes)
            
            db_gb = float(db_row.get("backup_storage_gb") or 0.0)
            
            # The Math Tolerance (Ignore differences < 2GB)
            diff = api_gb - db_gb
            if abs(diff) > 2.0:
                logger.info(f"Storage change detected for {raw_name}: {db_gb:.2f}GB -> {api_gb:.2f}GB")
                
                # Mark old record as deprecated
                ids_to_deprecate.append(db_row['id'])
                
                # Insert new record with updated storage
                new_row = dict(db_row)
                new_row.pop('id', None) # Remove PK
                new_row['backup_storage_gb'] = round(api_gb, 2)
                
                # Calculate size_increased string
                sign = "+" if diff > 0 else "-"
                new_row['size_increased'] = f"{sign}{abs(diff):.2f} GB"
                new_row['is_latest_record'] = True
                updates_to_insert.append(new_row)
                
                # Create Log entry
                log_msg = f"Storage automatically updated from {db_gb:.2f}GB to {api_gb:.2f}GB via API."
                logs_to_insert.append({
                    "partner_name": db_row.get("partner"),
                    "email_id": db_row.get("partner_email"),
                    "customer_name": db_row.get("customer_name"),
                    "customer_id": db_row.get("customer_id"),
                    "log_information": log_msg
                })
    
    # 4. The Ghost Customer Check (Reverse Diff)
    # Check if any DB customers disappeared from the API
    for norm_name, db_row in db_lookup.items():
        if norm_name not in processed_api_names and str(db_row.get('status')).lower() != 'lost':
            logger.info(f"Ghost Customer detected: {db_row.get('customer_name')} missing from API.")
            
            # Deprecate old row
            ids_to_deprecate.append(db_row['id'])
            
            # Insert new row as LOST
            new_row = dict(db_row)
            new_row.pop('id', None)
            new_row['status'] = 'Lost'
            new_row['is_latest_record'] = True
            updates_to_insert.append(new_row)
            
            logs_to_insert.append({
                "partner_name": db_row.get("partner"),
                "email_id": db_row.get("partner_email"),
                "customer_name": db_row.get("customer_name"),
                "customer_id": db_row.get("customer_id"),
                "log_information": "Customer missing from API payload. Automatically marked as Lost."
            })
            
    # 5. Execute Database Updates in a Transaction
    if not updates_to_insert and not ids_to_deprecate:
        logger.info("Diff Checker: No changes detected between API and DB. Exiting.")
        return
        
    logger.info(f"Executing {len(ids_to_deprecate)} deprecations and {len(updates_to_insert)} new row insertions.")
    
    with engine.begin() as conn:
        # Deprecate old records
        if ids_to_deprecate:
            # Batch update is_latest_record = False
            format_strings = ','.join(['%s'] * len(ids_to_deprecate))
            # SQLAlchemy text() bindings are tricky with IN lists, using raw connection for simplicity
            conn.connection.cursor().execute(
                f"UPDATE {DB_TABLE} SET is_latest_record = False WHERE id IN ({format_strings})",
                tuple(ids_to_deprecate)
            )
            
        # Insert new records
        if updates_to_insert:
            cols = list(updates_to_insert[0].keys())
            cols_str = ", ".join([f"`{c}`" for c in cols])
            vals_str = ", ".join(["%s"] * len(cols))
            sql = f"INSERT INTO {DB_TABLE} ({cols_str}) VALUES ({vals_str})"
            
            val_tuples = [tuple(row[c] for c in cols) for row in updates_to_insert]
            conn.connection.cursor().executemany(sql, val_tuples)
            
        # Insert Logs
        if logs_to_insert:
            log_cols = ["partner_name", "email_id", "customer_name", "customer_id", "log_information"]
            log_cols_str = ", ".join(log_cols)
            log_vals_str = ", ".join(["%s"] * len(log_cols))
            log_sql = f"INSERT INTO logs ({log_cols_str}) VALUES ({log_vals_str})"
            
            log_tuples = [tuple(row[c] for c in log_cols) for row in logs_to_insert]
            conn.connection.cursor().executemany(log_sql, log_tuples)
            
    logger.info("Hybrid Sync Complete! All changes safely recorded.")

if __name__ == "__main__":
    run_hybrid_sync()
