import { type RedirectType } from 'next/navigation';

export function getDefaultRedirect(redirectTo?: string | null): {
  destination: string;
  type: RedirectType;
} {
  // If a specific redirect is provided, use it
  if (redirectTo && !redirectTo.includes('/login')) {
    return {
      destination: redirectTo,
      type: 'replace'
    };
  }

  // Default redirect to dashboard
  return {
    destination: '/dashboard',
    type: 'replace'
  };
}