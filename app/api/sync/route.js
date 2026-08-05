import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(request) {
    try {
        const body = await request.json();
        const type = body.type || 'api'; // 'api' or 'sheet'
        
        return new Promise((resolve) => {
            const scriptName = type === 'sheet' ? 'sync.js' : 'hybrid_sync.js';
            const scriptPath = path.join(process.cwd(), 'scripts', scriptName);
            
            exec(`node ${scriptPath}`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Sync script error: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return resolve(NextResponse.json(
                        { status: 'error', message: 'Sync failed to execute.', details: stderr }, 
                        { status: 500 }
                    ));
                }
                
                console.log(`Sync script output: ${stdout}`);
                resolve(NextResponse.json({ 
                    status: 'success', 
                    message: `Real-time ${type} sync completed successfully.`,
                    output: stdout 
                }));
            });
        });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: 'Invalid request payload.' }, { status: 400 });
    }
}
