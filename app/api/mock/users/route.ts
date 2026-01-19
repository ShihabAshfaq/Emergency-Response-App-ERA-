import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function GET() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const users = JSON.parse(data);
        return NextResponse.json(users);
    } catch (error) {
        // If file doesn't exist, return empty array or default admin
        console.error("Error reading users:", error);
        return NextResponse.json([
            {
                id: 'admin-1',
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password',
                role: 'admin'
            }
        ]);
    }
}

export async function POST(request: Request) {
    try {
        const users = await request.json();
        await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error writing users:", error);
        return NextResponse.json({ error: 'Failed to save users' }, { status: 500 });
    }
}
