// api/etsy.js — Vercel serverless function
// Proxies requests to Etsy API, solving the CORS browser restriction

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const ETSY_KEY = process.env.ETSY_API_KEY;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Missing access token' });
  if (!ETSY_KEY) return res.status(500).json({ error: 'API key not configured' });

  // Build Etsy URL from query params
  const { path, ...rest } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const qs = new URLSearchParams(rest).toString();
  const etsyUrl = `https://api.etsy.com/v3/application/${path}${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(etsyUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-api-key': ETSY_KEY,
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
