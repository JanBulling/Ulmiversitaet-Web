import { env } from "@/env.mjs";

export const sessionConfig = {
  cookieName: "session",
  password: env.SESSION_SECRET,
  expires: 12 * 60 * 60 * 1000, // 12 hours
  cookieOptions: {
    httpOnly: true,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    secure: env.NODE_ENV === "production",
  },
};
