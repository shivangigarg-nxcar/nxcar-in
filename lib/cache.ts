interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stale = new Map<string, any>();
  private maxSize: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
    if (this.stale.size > this.maxSize / 2) {
      this.stale.clear();
    }
  }

  private evictOldest(): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        this.stale.delete(firstKey);
      }
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.stale.set(key, entry.data);
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  getStale<T>(key: string): T | null {
    return (this.stale.get(key) as T) ?? null;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.evictOldest();
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    });
    this.stale.delete(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.stale.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.stale.clear();
  }
}

export const apiCache = new MemoryCache(100);

export async function cachedFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = apiCache.get<T>(key);
  if (cached !== null) return cached;
  try {
    const data = await fetcher();
    apiCache.set(key, data, ttlSeconds);
    return data;
  } catch (error) {
    const stale = apiCache.getStale<T>(key);
    if (stale !== null) return stale;
    throw error;
  }
}

export function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}
