import { NextResponse } from 'next/server';
import alertPool from '@/lib/alert-db';

export async function GET() {
    try {
        const [rows] = await alertPool.query(
            `SELECT id, aws_alarm_name, instance_id, state_reason, timestamp, status, audience_count, acknowledged_by, acknowledged_at 
             FROM alarms 
             WHERE status = 'ACKNOWLEDGED' 
             ORDER BY acknowledged_at DESC 
             LIMIT 100`
        );
        return NextResponse.json({ alarms: rows });
    } catch (err: any) {
        console.error('Failed to fetch alarm history:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
