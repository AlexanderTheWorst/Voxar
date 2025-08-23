// lib/cache.js
export const cache = new Map();

// Example TTL helper
export function setCache(key, value, ttl = 60_000) {
    const expires = Date.now() + ttl;
    cache.set(key, { value, expires });
}

export function getCache(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}