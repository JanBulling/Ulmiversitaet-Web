import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.info("[WEBHOOK - POST]", data);
  return new Response("success", { status: 200 });
}
