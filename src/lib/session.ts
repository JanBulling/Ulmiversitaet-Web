import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { sessionsTable } from "./db/schema";
import jwt from "./jwt";
import { db } from "./db/db";
import { sessionConfig } from "@/config/session";

export const ROLES = ["ADMIN", "DEVELOPER", "USER"] as const;
export type RoleType = (typeof ROLES)[number];
export const isRole = (x: RoleType): x is RoleType => ROLES.includes(x);

export type ServerSession = {
  id: string;
  role: RoleType;
};

export async function getSession(): Promise<ServerSession | undefined> {
  const sessionToken = (await cookies()).get(sessionConfig.cookieName)?.value;
  if (!sessionToken) return undefined;

  return getSessionFromToken(sessionToken);
}

export async function getServerSession(): Promise<ServerSession | undefined> {
  const sessionToken = (await cookies()).get(sessionConfig.cookieName)?.value;

  if (typeof sessionToken !== "string") return undefined;

  return getSessionFromToken(sessionToken);
}

async function getSessionFromToken(
  token: string,
): Promise<ServerSession | undefined> {
  const session = await jwt.verify(token, sessionConfig.password);
  if (!session?.id || typeof session.id !== "string") return undefined;
  if (
    !session?.role ||
    typeof session.role !== "string" ||
    !isRole(session.role as RoleType)
  )
    return undefined;

  let sessionResult:
    | {
        id: string;
        expiresIn?: Date | null;
      }
    | undefined = undefined;

  try {
    switch (session.role) {
      case "ADMIN":
      case "DEVELOPER":
        [sessionResult] = await db
          .select({
            id: sessionsTable.id,
            expiresIn: sessionsTable.expires_in,
          })
          .from(sessionsTable)
          .where(eq(sessionsTable.id, session.id));

        break;
    }
  } catch (err) {
    return undefined;
  }

  if (
    !sessionResult ||
    !sessionResult.expiresIn ||
    sessionResult.expiresIn < new Date()
  )
    return undefined;

  return {
    id: sessionResult.id,
    role: "ADMIN",
  };
}
