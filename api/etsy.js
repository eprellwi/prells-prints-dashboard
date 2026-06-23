export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  const { path, ...rest } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const KEYSTRING = '60megc96vue75h2ycvdkihb7';
  const SHARED_SECRET = '2grqd3qeoz';

  const qs = new URLSearchParams(rest).toString();
  const etsyUrl = `https://openapi.etsy.com/v3/application/${path}${qs ? '?' + qs : ''}`;

  const response = await fetch(etsyUrl, {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': `${KEYSTRING}:${SHARED_SECRET}`,
      'Accept': 'application/json'
    }
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
