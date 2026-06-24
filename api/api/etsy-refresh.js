export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const KEYSTRING = '60megc96vue75h2ycvdkihb7';
  const SHARED_SECRET = '2grqd3qeoz';
  const REFRESH_TOKEN = '19815826.cP_DVc304cHAAnxk7vtP-AB2zknPlCZfNj0Mry_nIKZDLzqOBa87-2uDdqLscFluLRlec0XTJg8MZEmjYaM6_9ZAvBY';

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: KEYSTRING,
    refresh_token: REFRESH_TOKEN,
  });

  const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-api-key': `${KEYSTRING}:${SHARED_SECRET}`,
    },
    body: body.toString(),
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
