export default async function handler(request, response) {
  try {
    const res = await fetch('https://votations.rastry.com/api/votes', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Monitor Votaciones)'
      }
    });
    
    const data = await res.json();

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.status(200).json(data);
    
  } catch (error) {
    response.status(500).json({ error: 'Error conectando con Rastry' });
  }
}