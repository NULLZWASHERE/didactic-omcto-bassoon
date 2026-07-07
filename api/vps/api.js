// app/api/xcloud/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const XCLOUD_BASE_URL = 'https://loremgroup.org'; // Your provided base URL
const API_KEY = 'ZI7gMHQnvCLLhqOcKIk-Bb9ab0mWSR-2n8gRSBFe3Kc'; // Enterprise Key

export async function GET(req: NextRequest) {
  return handleRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return handleRequest(req, 'POST');
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, 'DELETE');
}

export async function PUT(req: NextRequest) {
  return handleRequest(req, 'PUT');
}

async function handleRequest(req: NextRequest, method: string) {
  try {
    const { pathname, search } = req.nextUrl;
    const path = pathname.replace(/^\/api\/xcloud/, '');
    
    // Ensure proper path formatting
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const targetUrl = `${XCLOUD_BASE_URL}${cleanPath}${search}`;

    let body: string | undefined = undefined;
    if (method !== 'GET') {
      body = await req.text();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Admin-Password': API_KEY,
    };

    // Enterprise flag for VM-related operations
    if (path.includes('/create') || path.includes('/vm/create') || path.includes('/premium')) {
      headers['x-enterprise'] = 'true';
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body || undefined,
    });

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json(
      {
        success: response.ok,
        status: response.status,
        data: data,
      },
      { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
        }
      }
    );

  } catch (error: any) {
    console.error('Xcloud Enterprise Proxy Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Enterprise proxy request failed',
        code: 'PROXY_ERROR'
      },
      { status: 500 }
    );
  }
}

// CORS Preflight
export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password, x-enterprise',
    },
  });
}
