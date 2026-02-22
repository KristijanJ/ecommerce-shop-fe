const API_URL = process.env.API_URL || "http://localhost";
const API_PORT = process.env.API_PORT || "3000";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}:${API_PORT}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error("backend unhealthy");
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
