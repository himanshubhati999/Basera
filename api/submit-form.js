// Vercel serverless function to handle HubSpot form submissions
// This bypasses CORS issues by proxying the request through your server

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { fields, context } = req.body;

    // Submit to HubSpot API
    const response = await fetch(
      'https://api.hsforms.com/submissions/v3/integration/submit/244826787/1dc60e00-39fd-403e-b865-4cc88a315b03',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields,
          context: context || {
            pageUri: req.headers.referer || '',
            pageName: 'Property Inquiry'
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({ success: true, data });
    } else {
      const errorText = await response.text();
      console.error('HubSpot API error:', errorText);
      return res.status(response.status).json({ 
        success: false, 
        error: 'Failed to submit form',
        details: errorText 
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
