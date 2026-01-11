// Serverless API endpoint for HubSpot form submissions
// This proxies form submissions to HubSpot API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { fields, context } = req.body;

    // Validate required fields
    if (!fields || !Array.isArray(fields)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid form data: fields array is required' 
      });
    }

    // HubSpot API configuration
    const HUBSPOT_PORTAL_ID = '244826787';
    const HUBSPOT_FORM_ID = '1dc60e00-39fd-403e-b865-4cc88a315b03';
    const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

    // Submit to HubSpot
    const hubspotResponse = await fetch(HUBSPOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: fields,
        context: context || {
          pageUri: 'https://property-website.vercel.app',
          pageName: 'Property Inquiry'
        }
      })
    });

    const hubspotData = await hubspotResponse.json();

    if (hubspotResponse.ok) {
      return res.status(200).json({ 
        success: true, 
        message: 'Form submitted successfully',
        data: hubspotData
      });
    } else {
      console.error('HubSpot submission error:', hubspotData);
      return res.status(hubspotResponse.status).json({ 
        success: false, 
        error: hubspotData.message || 'HubSpot submission failed',
        details: hubspotData
      });
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
