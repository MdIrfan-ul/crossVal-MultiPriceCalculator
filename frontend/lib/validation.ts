const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidPassword(value: string): boolean {
  // Minimum bar for the client-side check only — the server is the
  // source of truth for real password policy.
  return value.length >= 8;
}

export interface FieldErrors {
  [key: string]: string | undefined;
}
