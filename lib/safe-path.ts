// A leading-slash check is not enough. Browsers normalise "/\evil.com" to a
// protocol-relative URL, and "/..//evil.com" resolves to "//evil.com" — both
// leave the site. Parse against a base and confirm the origin survived.
const BASE = "http://internal.invalid";

export function safePath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/")) return null;
  let url: URL;
  try {
    url = new URL(raw, BASE);
  } catch {
    return null;
  }
  if (url.origin !== BASE) return null;
  const path = `${url.pathname}${url.search}${url.hash}`;
  return path.startsWith("//") ? null : path;
}
