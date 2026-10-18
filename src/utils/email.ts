export const INSTITUTIONAL_EMAIL_DOMAIN = "@ucundinamarca.edu.co";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isInstitutionalEmail(email: string) {
  return normalizeEmail(email).endsWith(INSTITUTIONAL_EMAIL_DOMAIN);
}