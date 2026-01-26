import { describe, it, expect } from 'vitest';
import { timestampToDate, dateToTimestamp, getCurrentTimestamp, formatDuration } from '../../utils/other/timestamp';

describe('Timestamp Utils', () => {
  it('converts timestamp to date', () => {
    const result = timestampToDate(1609459200000);
    expect(result.unix).toBe(1609459200000);
    expect(result.iso).toBe('2021-01-01T00:00:00.000Z');
    expect(result.utc).toContain('2021');
    expect(result.local).toBeDefined();
  });

  it('converts valid date string', () => {
    const result = dateToTimestamp('2021-01-01T00:00:00Z');
    expect(result.success).toBe(true);
    expect(result.result?.unix).toBe(1609459200000);
  });

  it('handles invalid date string', () => {
    const result = dateToTimestamp('not a date');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('gets current timestamp', () => {
    const now = Date.now();
    const result = getCurrentTimestamp();
    expect(result.unix).toBeGreaterThanOrEqual(now - 1000);
    expect(result.unix).toBeLessThanOrEqual(now + 1000);
  });

  it('formats milliseconds', () => {
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(1500)).toBe('1.50s');
    expect(formatDuration(90000)).toBe('1.50m');
    expect(formatDuration(3600000)).toBe('1.00h');
    expect(formatDuration(86400000)).toBe('1.00d');
  });

  it('handles zero duration', () => {
    expect(formatDuration(0)).toBe('0ms');
  });
});
