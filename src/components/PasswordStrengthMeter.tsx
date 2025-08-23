import { getPasswordStrengthProps } from '../utils/passwordUtils';

export const PasswordStrengthMeter = ({ score }: { score: number }) => {
  const { label, color } = getPasswordStrengthProps(score);

  if (!label) return null;

  return <div style={{ fontSize: '12px', color }}>Сложность: {label}</div>;
};
