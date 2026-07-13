import { NextResponse, type NextRequest } from 'next/server';

export type ProxyResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  metrics: {
    requestTimeIso: string;
    responseTimeIso: string;
    durationMs: number;
  };
};

type ProxyRequestBody = {
  targetUrl: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
};

function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return Object.entries(value).every(([key, val]) => typeof key === 'string' && typeof val === 'string');
}

function isProxyRequestBody(data: unknown): data is ProxyRequestBody {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const hasTargetUrl = 'targetUrl' in data && typeof data.targetUrl === 'string';
  const hasMethod = 'method' in data && typeof data.method === 'string';

  const hasValidHeaders = 'headers' in data && isStringRecord(data.headers);

  const hasValidBody = !('body' in data) || data.body === null || typeof data.body === 'string';

  return hasTargetUrl && hasMethod && hasValidHeaders && hasValidBody;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody: unknown = await request.json();

    if (!isProxyRequestBody(rawBody)) {
      return NextResponse.json({ error: 'Invalid request payload structure' }, { status: 400 });
    }

    const { targetUrl, method, headers, body } = rawBody;
    const normalizedMethod = method.toUpperCase();

    const requestHeaders = new Headers();
    Object.entries(headers).forEach(([key, value]) => {
      requestHeaders.append(key, value);
    });

    const fetchOptions: RequestInit = {
      method: normalizedMethod,
      headers: requestHeaders,
      cache: 'no-store',
    };

    if (normalizedMethod !== 'GET' && normalizedMethod !== 'HEAD' && body !== null) {
      fetchOptions.body = body;
    }

    const startTimestamp = Date.now();
    const requestTimeIso = new Date(startTimestamp).toISOString();

    const targetResponse = await fetch(targetUrl, fetchOptions);

    const endTimestamp = Date.now();
    const responseTimeIso = new Date(endTimestamp).toISOString();
    const durationMs = endTimestamp - startTimestamp;

    const responseHeaders: Record<string, string> = {};
    targetResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const responseText = await targetResponse.text();

    const responseData: ProxyResponseData = {
      status: targetResponse.status,
      statusText: targetResponse.statusText,
      headers: responseHeaders,
      body: responseText,
      metrics: {
        requestTimeIso,
        responseTimeIso,
        durationMs,
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown proxy error';

    return NextResponse.json({ error: 'Failed to proxy request', details: errorMessage }, { status: 500 });
  }
}
