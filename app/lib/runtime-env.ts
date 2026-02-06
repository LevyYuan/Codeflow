/**
 * Runtime environment adapter
 * Supports both Cloudflare Workers and Node.js (Vercel) environments
 */

interface CloudflareContext {
  cloudflare?: {
    env?: Record<string, any>;
  };
}

/**
 * Get server environment variables
 * Works in both Cloudflare Workers and Node.js environments
 */
export function getServerEnv(context?: CloudflareContext): Record<string, any> {
  // Cloudflare Workers environment
  if (context?.cloudflare?.env) {
    return context.cloudflare.env;
  }

  // Node.js environment (Vercel, local dev, etc.)
  return process.env as Record<string, any>;
}

/**
 * Check if running in Cloudflare Workers environment
 */
export function isCloudflareWorkers(context?: CloudflareContext): boolean {
  return !!context?.cloudflare?.env;
}

/**
 * Check if running in Node.js environment
 */
export function isNodeEnvironment(): boolean {
  return typeof process !== 'undefined' && process.env !== undefined;
}
