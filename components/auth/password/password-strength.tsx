'use client';

import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthText = (strength: number): string => {
    if (strength === 0) return 'Very Weak';
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const strength = calculateStrength(password);
  const strengthText = getStrengthText(strength);

  return (
    <div className="space-y-2">
      <Progress value={strength} className="h-2" />
      <p className="text-sm text-muted-foreground">
        Password strength: {strengthText}
      </p>
    </div>
  );
}