import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        let email = searchParams.get('email');
        
        if (!email) {
            return NextResponse.json({ detail: "Email parameter missing" }, { status: 400 });
        }
        email = email.trim().toLowerCase();

        const isSuperadmin = email === 'sharma.himanshu@elcom.com';
        
        let rows = [];
        if (isSuperadmin) {
            [rows] = await db.query(`SELECT * FROM logs ORDER BY created_at DESC LIMIT 50`);
        } else {
            [rows] = await db.query(`SELECT * FROM logs WHERE email_id = ? ORDER BY created_at DESC LIMIT 50`, [email]);
        }

        const data = rows.map(row => {
            const dateObj = new Date(row.created_at);
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            return {
                id: row.id,
                customer_name: row.customer_name,
                customer_id: row.customer_id,
                log_information: row.log_information,
                created_at: formattedDate
            };
        });

        return NextResponse.json({ status: "success", data });
    } catch (error) {
        console.error("Log fetch error:", error);
        return NextResponse.json({ detail: "Failed to retrieve logs." }, { status: 500 });
    }
}
