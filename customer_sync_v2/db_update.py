import pymysql
from config import get_db_uri
from sqlalchemy import create_engine, text

def update_schema():
    print("Connecting to database...")
    engine = create_engine(get_db_uri())
    
    with engine.begin() as conn:
        # Add is_latest_record if it doesn't exist
        print("Checking if is_latest_record exists...")
        try:
            conn.execute(text("ALTER TABLE backup_history ADD COLUMN is_latest_record BOOLEAN DEFAULT TRUE;"))
            print("Added is_latest_record column to backup_history.")
        except Exception as e:
            print("Column is_latest_record may already exist:", str(e))
            
        # Create logs table
        print("Creating logs table...")
        create_logs_sql = """
        CREATE TABLE IF NOT EXISTS logs (
            id BIGINT NOT NULL AUTO_INCREMENT,
            partner_name VARCHAR(255),
            email_id VARCHAR(255),
            customer_name VARCHAR(255),
            customer_id VARCHAR(100),
            log_information TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        """
        conn.execute(text(create_logs_sql))
        print("Successfully ensured logs table exists.")
        
if __name__ == "__main__":
    update_schema()
