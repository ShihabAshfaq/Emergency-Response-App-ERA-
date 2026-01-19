import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'admin_logs.json');

export async function GET() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const logs = JSON.parse(data);
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const newLog = await request.json();

        // Read existing logs
        let logs = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            logs = JSON.parse(data);
        } catch (e) {
            logs = [];
        }

        // Add new log to start (newest first)
        logs.unshift(newLog);

        await fs.writeFile(DATA_FILE, JSON.stringify(logs, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error writing admin logs:", error);
        return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
    }
}
