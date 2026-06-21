interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit({ maxRequests, windowMs }: RateLimitConfig) {
  return {
    check(key: string): { success: boolean; remaining: number } {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || entry.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: maxRequests - 1 };
      }

      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: maxRequests - entry.count };
    },
  };
}
