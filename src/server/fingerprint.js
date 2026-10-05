import crypto from "node:crypto";

/** Empreinte anonyme (IP + user-agent) pour dédupliquer les likes. */
export function fingerprintFor(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded) || request.ip || "";
  const firstIp = String(ip).split(",")[0].trim();
  const ua = request.headers["user-agent"] || "";
  return crypto
    .createHash("sha256")
    .update(`${firstIp}|${ua}`)
    .digest("hex")
    .slice(0, 32);
}
