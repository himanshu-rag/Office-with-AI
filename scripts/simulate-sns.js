const http = require('http');

const data = JSON.stringify({
  Type: "Notification",
  MessageId: "12345-abcde",
  TopicArn: "arn:aws:sns:us-east-1:123456789012:App-Alarms",
  Subject: "ALARM: EC2-CPU-i-0abcd1234efgh5678 in US East (N. Virginia)",
  Message: JSON.stringify({
    AlarmName: "EC2-CPU-i-0abcd1234efgh5678",
    AlarmDescription: "CPU utilization is too high",
    AWSAccountId: "123456789012",
    NewStateValue: "ALARM",
    NewStateReason: "Threshold Crossed: 1 out of the last 1 datapoints [95.5] was greater than the threshold (80.0)",
    StateChangeTime: new Date().toISOString(),
    Region: "US East (N. Virginia)",
    OldStateValue: "OK"
  }),
  Timestamp: new Date().toISOString(),
  SignatureVersion: "1",
  Signature: "EXAMPLE",
  SigningCertURL: "EXAMPLE",
  UnsubscribeURL: "EXAMPLE"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/webhooks/aws-sns',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'x-amz-sns-message-type': 'Notification',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`\nStatus Code: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
    console.log('\n');
  });
});

req.on('error', (error) => {
  console.error("Error connecting to localhost:3000. Make sure the Next.js dev server is running.");
});

req.write(data);
req.end();
