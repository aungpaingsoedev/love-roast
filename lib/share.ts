import type { ChallengePayload, StoredResultPayload } from "@/lib/types";

function toBase64Url(value: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const base64 = padded + pad;
  if (typeof window === "undefined") {
    return Buffer.from(base64, "base64").toString("utf8");
  }
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeResult(payload: StoredResultPayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeResult(id: string): StoredResultPayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(id)) as StoredResultPayload;
    if (parsed?.v !== 1 || !parsed.test || !parsed.result) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function encodeChallenge(payload: ChallengePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeChallenge(id: string): ChallengePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(id)) as ChallengePayload;
    if (parsed?.v !== 1 || !parsed.challengerName || !parsed.test) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function resultPath(id: string): string {
  return `/result/${id}`;
}

export function challengePath(id: string): string {
  return `/challenge/${id}`;
}

export function absoluteUrl(path: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return path;
}

export async function shareOrCopy(opts: {
  title: string;
  text: string;
  url: string;
}): Promise<"shared" | "copied" | "failed"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(opts);
      return "shared";
    } catch {
      // fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(opts.url);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
