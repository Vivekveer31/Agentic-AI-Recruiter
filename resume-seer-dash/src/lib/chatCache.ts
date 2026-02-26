// ---------------------------------------------------------------------------
// Chat prompt cache  –  localStorage, 24-hour TTL
// ---------------------------------------------------------------------------

const STORAGE_KEY = "hr_chat_cache";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  response: string;
  timestamp: number; // Date.now()
}

type CacheStore = Record<string, CacheEntry>;

function normalise(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function load(): CacheStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CacheStore) : {};
  } catch {
    return {};
  }
}

function save(store: CacheStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage quota exceeded – silently skip
  }
}

/** Returns the cached response string, or null if missing / stale. */
export function cacheGet(query: string): string | null {
  const store = load();
  const key = normalise(query);
  const entry = store[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    // evict stale entry
    delete store[key];
    save(store);
    return null;
  }
  return entry.response;
}

/** Persist a response for the given query. */
export function cacheSet(query: string, response: string): void {
  const store = load();
  store[normalise(query)] = { response, timestamp: Date.now() };
  save(store);
}

/** Check whether a valid (non-stale) cache entry exists. */
export function cacheHas(query: string): boolean {
  return cacheGet(query) !== null;
}

/** Wipe all entries (useful for "clear cache" button). */
export function cacheClear(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Return the number of cached entries. */
export function cacheSize(): number {
  return Object.keys(load()).length;
}
