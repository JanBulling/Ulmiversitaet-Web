import { base64url, JWTPayload, jwtVerify, SignJWT } from "jose";

export async function sign(
  payload: JWTPayload,
  secret: string,
  expiresIn: number,
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

export function read(jwt: string): { [key: string]: string } {
  return JSON.parse(base64url.decode(jwt.split(".")[1] ?? "").toString());
}

export async function verify(
  jwt: string,
  secret: string,
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(jwt, new TextEncoder().encode(secret));
    return payload;
  } catch {
    return null;
  }
}

export default { sign, read, verify };
