import { NextResponse } from 'next/server';
import alertPool from '@/lib/alert-db';

export async function POST(req: Request) {
    try {
        // AWS SNS sends payload as text/plain usually
        const bodyText = await req.text();
        const payload = JSON.parse(bodyText);
        
        const messageType = req.headers.get('x-amz-sns-message-type');

        if (messageType === 'SubscriptionConfirmation') {
            const subscribeUrl = payload.SubscribeURL;
            if (subscribeUrl) {
                // Confirm the subscription by fetching the URL
                await fetch(subscribeUrl);
                return NextResponse.json({ status: 'confirmed' });
            }
        } else if (messageType === 'Notification') {
            // The CloudWatch alarm data is inside the Message property as a JSON string
            const message = JSON.parse(payload.Message);
            const alarmName = message.AlarmName;
            const stateReason = message.NewStateReason || message.StateReason || 'No reason provided';
            
            // Extract instance-id from alarmName if possible (e.g. EC2-CPU-i-12345678)
            let instanceId = 'Unknown';
            if (alarmName && alarmName.includes('-i-')) {
                const match = alarmName.match(/i-[a-z0-9]+/);
                if (match) instanceId = match[0];
            } else if (alarmName) {
                const parts = alarmName.split('-');
                if (parts.length > 2) {
                    instanceId = parts[parts.length - 1]; 
                }
            }

            const query = `
                INSERT INTO alarms (aws_alarm_name, instance_id, state_reason, status)
                VALUES (?, ?, ?, 'ACTIVE')
            `;
            await alertPool.query(query, [alarmName, instanceId, stateReason]);
            
            return NextResponse.json({ status: 'inserted', alarmName, instanceId });
        }
        
        return NextResponse.json({ status: 'ignored' });
    } catch (err: any) {
        console.error('Error processing SNS webhook:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
