export function calculatePasswordStrength(pwd: string): number {
  if (!pwd) return 0;

  let score = 0;

  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;

  if (/[0-9]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  return score;
}
