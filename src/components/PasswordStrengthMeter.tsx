import { getPasswordStrengthProps } from '../utils/passwordUtils';

export const PasswordStrengthMeter = ({ score }: { score: number }) => {
  if (score === 0) return null;

  const { label, color } = getPasswordStrengthProps(score);

  return <div style={{ fontSize: '12px', color }}>Сложность: {label}</div>;
};
