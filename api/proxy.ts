export default async function handler(req: any, res: any) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing target URL");
  }

  try {
    const fetchOptions: any = {
      method: req.method,
      headers: {
        "Accept": "*/*",
        "User-Agent": "curl/8.4.0",
      }
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      fetchOptions.body = req.body;
      fetchOptions.headers["Content-Type"] = req.headers["content-type"] || "application/json";
      fetchOptions.headers["Channel"] = req.headers["channel"] || "320";
    }

    const response = await fetch(url as string, fetchOptions);
    const text = await response.text();

    res.setHeader("Content-Type", response.headers.get("content-type") || "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(text);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}
