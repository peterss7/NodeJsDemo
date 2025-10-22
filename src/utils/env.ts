// src/utils/env.ts
export function getEnv(key: string, fallback?: string): string {
    const v = process.env[key];
    if (v !== undefined) return v;
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
}

export function getEnvInt(key: string, fallback?: number): number {
    const s = process.env[key];
    if (s !== undefined) {
        const n = Number.parseInt(s, 10);
        if (Number.isNaN(n)) throw new Error(`Env ${key} is not an integer: ${s}`);
        return n;
    }
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
}

export function getEnvBool(key: string, fallback?: boolean): boolean {
    const s = process.env[key];
    if (s !== undefined) {
        return ['1', 'true', 'yes', 'on'].includes(s.toLowerCase());
    }
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
}
