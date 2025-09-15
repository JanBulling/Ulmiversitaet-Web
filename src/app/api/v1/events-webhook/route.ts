import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.text();
  const headers = req.headers;
  console.info("[WEBHOOK - POST]", "headers", headers);
  console.info("[WEBHOOK - POST]", data);
  return new Response("success", { status: 200 });
}
