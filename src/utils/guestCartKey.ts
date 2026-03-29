const STORAGE_KEY = "ecom_guest_cart_key";

/** Accepts UUID v4 from `crypto.randomUUID()` */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getGuestCartKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function ensureGuestCartKey(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing && UUID_RE.test(existing)) {
    return existing;
  }
  const next = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, next);
  return next;
}

export function regenerateGuestCartKey(): void {
  localStorage.setItem(STORAGE_KEY, crypto.randomUUID());
}
