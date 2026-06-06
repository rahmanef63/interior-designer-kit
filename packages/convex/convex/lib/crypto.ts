/**
 * AES-256-GCM secret encryption using Web Crypto.
 * Runs in the Convex default runtime (crypto.subtle, atob/btoa available).
 *
 * KEY_VAULT_SECRET must be a base64-encoded 32-byte key. Generate with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * Payload layout: base64( iv[12 bytes] || ciphertext+tag ).
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

async function importKey(secretB64: string): Promise<CryptoKey> {
  const raw = b64ToBytes(secretB64);
  if (raw.length !== 32) {
    throw new Error("KEY_VAULT_SECRET must decode to 32 bytes");
  }
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptSecret(plaintext: string, secretB64: string): Promise<string> {
  const key = await importKey(secretB64);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(plaintext)),
  );
  const out = new Uint8Array(iv.length + ct.length);
  out.set(iv, 0);
  out.set(ct, iv.length);
  return bytesToB64(out);
}

export async function decryptSecret(payloadB64: string, secretB64: string): Promise<string> {
  const key = await importKey(secretB64);
  const data = b64ToBytes(payloadB64);
  const iv = data.slice(0, 12);
  const ct = data.slice(12);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return decoder.decode(pt);
}
