export class Storage {
  private static isAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  static get<T>(key: string, fallback: T): T {
    if (!this.isAvailable()) return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  static set<T>(key: string, value: T): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  static remove(key: string): void {
    if (this.isAvailable()) {
      window.localStorage.removeItem(key);
    }
  }
}
