export function generateStudioCode() {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}
