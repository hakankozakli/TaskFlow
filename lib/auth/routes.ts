export const publicRoutes = [
  '/',                    // Landing page
  '/login',              // Login page
  '/signup',             // Signup page
  '/onboarding',         // Onboarding flow
  '/pricing',            // Pricing page
  '/auth/callback',      // Auth callback
  '/api/auth/reset-demo', // Demo reset endpoint
  '/api/stripe/webhook',  // Stripe webhook
  '/api/stripe/checkout', // Stripe checkout
  '/api/health',         // Health check
] as const;

export const staticRoutes = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
] as const;

export function isPublicRoute(path: string) {
  return publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
}

export function isStaticRoute(path: string) {
  return staticRoutes.some(route => 
    path.startsWith(route)
  );
}

export function getRedirectUrl(path: string) {
  // Default to dashboard if no specific redirect
  if (!path || path === '/login' || path === '/signup' || path === '/onboarding') {
    return '/dashboard';
  }
  
  // Only redirect to internal paths
  if (path.startsWith('/')) {
    return path;
  }
  
  return '/dashboard';
}