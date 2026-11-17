import { SCHEMA_LIMITS } from '../data/defaultData';

export function formatCurrency(price: number, listingType?: 'Sale' | 'Rent'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(price) ? price : 0);
  return listingType === 'Rent' ? `${formatted}/mo` : formatted;
}

export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

export function toTelHref(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return `tel:${digits || raw}`;
}

export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const safe = base.slice(0, SCHEMA_LIMITS.SLUG_MAX);
  return safe.length >= 2 ? safe : `listing-${Date.now()}`;
}

export function generateSafeId(prefix: string): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20) || 'item';
  const rand = Math.random().toString(36).slice(2, 8);
  return `${cleanPrefix}-${Date.now()}-${rand}`;
}

export function clampString(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

export function clampNumber(val: unknown, min: number, max: number, fallback = 0): number {
  const num = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

export function clampStringArray(val: unknown, maxItems: number, maxItemLen: number): string[] {
  if (!Array.isArray(val)) return [];
  return val
    .map((item) => clampString(String(item ?? ''), maxItemLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export function formatDateDisplay(ts: unknown): string {
  if (!ts) return 'Just now';
  try {
    if (typeof ts === 'object' && ts !== null && 'toDate' in ts && typeof (ts as { toDate: () => Date }).toDate === 'function') {
      return (ts as { toDate: () => Date }).toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    const date = new Date(String(ts));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  } catch {
    return 'Recent';
  }
  return 'Recent';
}
