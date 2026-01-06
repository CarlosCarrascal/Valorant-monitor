import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://votations.rastry.com/api/votes', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Monitor Votaciones Pro)',
        'Cache-Control': 'no-cache, no-store'
      },
      next: { revalidate: 0 } 
    });

    if (!res.ok) throw new Error('Error conectando con Rastry');
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}