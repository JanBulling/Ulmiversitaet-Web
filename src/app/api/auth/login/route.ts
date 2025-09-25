import { sessionConfig } from "@/config/session";
import { env } from "@/env.mjs";
import { db } from "@/lib/db/db";
import { sessionsTable } from "@/lib/db/schema";
import jwt from "@/lib/jwt";
import { cookies } from "next/headers";
import z from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = schema.safeParse(json);
    if (!body.success) new Response("Invalid request", { status: 400 });

    const loginData = body.data;

    if (
      loginData?.username !== env.ADMIN_USERNAME ||
      loginData?.password !== env.ADMIN_PASSWORD
    ) {
      new Response("Login data is invalid", { status: 401 });
    }

    // session expiration date is set to 12 hours from now
    const sessionExpires = new Date(Date.now() + sessionConfig.expires);

    const [createdSession] = await db
      .insert(sessionsTable)
      .values({
        role: "ADMIN",
        expires_in: sessionExpires,
      })
      .returning({ id: sessionsTable.id });

    const sessionToken = await jwt.sign(
      { id: createdSession.id, role: "ADMIN" },
      sessionConfig.password,
      sessionConfig.expires,
    );

    (await cookies()).set(sessionConfig.cookieName, sessionToken, {
      maxAge: sessionConfig.expires / 1000,
      ...sessionConfig.cookieOptions,
    });

    return new Response("Success");
  } catch (err) {
    console.error("[Login - POST]", err);
    return new Response("Internal server error", { status: 500 });
  }
}
