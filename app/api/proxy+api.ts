export async function GET(request: Request) {
  return handleProxy(request);
}

export async function POST(request: Request) {
  return handleProxy(request);
}

async function handleProxy(request: Request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing target URL", { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const fetchOptions: RequestInit = {
      method: request.method,
      signal: controller.signal,
      headers: {
        "Accept": "*/*",
        "User-Agent": "curl/8.4.0",
      }
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      fetchOptions.body = await request.text();
      fetchOptions.headers = {
        ...fetchOptions.headers,
        "Content-Type": request.headers.get("Content-Type") || "application/json",
        "Channel": request.headers.get("Channel") || "320",
      };
    }

    let response;
    try {
      response = await fetch(targetUrl, fetchOptions);
    } finally {
      clearTimeout(timeoutId);
    }
    
    if (!response.ok) {
      return new Response(`Error fetching target: ${response.status}`, { status: response.status, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const text = await response.text();
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Channel",
      },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

