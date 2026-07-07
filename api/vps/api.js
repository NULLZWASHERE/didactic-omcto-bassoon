// api.js
export default async function handler(req, res) {
  const XCLOUD_BASE_URL = 'https://loremgroup.org/';
  const API_KEY = 'ZI7gMHQnvCLLhqOcKIk-Bb9ab0mWSR-2n8gRSBFe3Kc';

  // Support /api/vps/... path
  let path = req.url.replace(/^\/api(\/vps)?/, '');
  if (!path.startsWith('/')) path = '/' + path;

  const targetUrl = `${XCLOUD_BASE_URL}${path}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'X-Admin-Password': API_KEY,
      'x-enterprise': 'true',
    };

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? req.body : undefined,
    });

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
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || 'Proxy failed',
    });
  }
}

// Optional: Handle CORS
export const config = {
  api: {
    bodyParser: true,
  },
};
