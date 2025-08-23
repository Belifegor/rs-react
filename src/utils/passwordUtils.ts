export const getPasswordStrengthProps = (score: number) => {
  if (score <= 1) return { label: 'Очень слабый', color: '#e74c3c' };
  if (score === 2) return { label: 'Слабый', color: '#f39c12' };
  if (score === 3) return { label: 'Средний', color: '#f1c40f' };
  if (score >= 4) return { label: 'Сильный', color: '#2ecc71' };
  return { label: '', color: 'transparent' };
};
