import { NextResponse } from 'next/server';
import alertPool from '@/lib/alert-db';

export async function GET() {
    try {
        const [rows] = await alertPool.query(
            `SELECT id, aws_alarm_name, instance_id, state_reason, timestamp, status, audience_count 
             FROM alarms 
             WHERE status = 'ACTIVE' 
             ORDER BY timestamp DESC`
        );
        return NextResponse.json({ alarms: rows });
    } catch (err: any) {
        console.error('Failed to fetch alarms:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

    export async function PUT(req: Request) {
        try {
            const { id, acknowledged_by } = await req.json();
            if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
            
            const ackBy = acknowledged_by || 'Unknown';
    
            await alertPool.query(
                `UPDATE alarms SET status = 'ACKNOWLEDGED', acknowledged_by = ?, acknowledged_at = NOW() WHERE id = ?`, 
                [ackBy, id]
            );
            return NextResponse.json({ status: 'success' });
    } catch (err: any) {
        console.error('Failed to acknowledge alarm:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
