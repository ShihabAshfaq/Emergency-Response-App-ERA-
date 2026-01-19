import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'requests.json');

export async function GET() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const requests = JSON.parse(data);
        return NextResponse.json(requests);
    } catch (error) {
        // If file doesn't exist, return empty array
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const requests = await request.json();
        await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error writing requests:", error);
        return NextResponse.json({ error: 'Failed to save requests' }, { status: 500 });
    }
}
