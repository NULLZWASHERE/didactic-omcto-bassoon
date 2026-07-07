export default async function handler(req, res) {
  const XCLOUD_BASE_URL = 'https://loremgroup.org';
  const API_KEY = 'ZI7gMHQnvCLLhqOcKIk-Bb9ab0mWSR-2n8gRSBFe3Kc';

  // Mapping /api/vps to /api ensures the request matches the 
  // structure documented in the API
  let path = req.url.replace(/^\/api\/vps/, '/api');
  
  if (!path || path === '') path = '/';
  if (!path.startsWith('/')) path = '/' + path;

  const targetUrl = `${XCLOUD_BASE_URL}${path}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': API_KEY,
        'x-enterprise': 'true',
      },
    };

    if (req.method !== 'GET' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data: data,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Proxy failed',
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
