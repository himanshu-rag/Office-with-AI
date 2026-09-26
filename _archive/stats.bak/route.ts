import { NextResponse } from 'next/server';
import { CloudWatchClient, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";

// Ensure AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY are in your .env
const cwClient = new CloudWatchClient({ region: process.env.AWS_REGION || "ap-south-1" });

export async function GET() {
    try {
        // NOTE: Replace these with your actual EC2 Instance IDs from the AWS Console
        const instances = {
            "nosky-bastion": "i-00000000000000001",
            "nosky_website": "i-00000000000000002",
            "NoSky_Backup_Centralize_Backend": "i-00000000000000003",
            "NoSky_Backup_webApp": "i-00000000000000004"
        };

        const startTime = new Date(Date.now() - 3 * 60 * 60 * 1000); // Last 3 hours
        const endTime = new Date();

        const metricDataQueries = [];
        let idCounter = 1;

        for (const [name, instanceId] of Object.entries(instances)) {
            metricDataQueries.push({
                Id: `cpu_${idCounter}`,
                MetricStat: {
                    Metric: {
                        Namespace: "AWS/EC2",
                        MetricName: "CPUUtilization",
                        Dimensions: [{ Name: "InstanceId", Value: instanceId }]
                    },
                    Period: 300, // 5 minutes
                    Stat: "Average",
                },
                ReturnData: true,
            });
            idCounter++;
        }

        const command = new GetMetricDataCommand({
            MetricDataQueries: metricDataQueries,
            StartTime: startTime,
            EndTime: endTime,
        });

        const response = await cwClient.send(command);
        
        // Format for the Android App
        const stats = response.MetricDataResults?.map((result, index) => ({
            label: Object.keys(instances)[index],
            timestamps: result.Timestamps,
            values: result.Values
        })) || [];

        return NextResponse.json({ stats });
    } catch (err: any) {
        console.error('Failed to fetch AWS stats:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
