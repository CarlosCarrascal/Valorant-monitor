import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch('https://votations.rastry.com/api/votes', {
            headers: { 'User-Agent': 'Monitor-V2026', 'Cache-Control': 'no-cache' },
            next: { revalidate: 0 }
        });

        if (!res.ok) throw new Error('Rastry API Error');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}