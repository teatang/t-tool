import { describe, it, expect } from 'vitest';
import { generateUUID, generateMultipleUUIDs, uuidVersions, isValidUUID } from '../../utils/other/uuid';

describe('UUID Utils', () => {
  it('generates valid UUID v4', () => {
    const uuid = generateUUID(4);
    expect(isValidUUID(uuid)).toBe(true);
    expect(uuid.split('-').length).toBe(5);
  });

  it('generates UUID v1', () => {
    const uuid = generateUUID(1);
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('generates UUID v3', () => {
    const uuid = generateUUID(3);
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('generates UUID v5', () => {
    const uuid = generateUUID(5);
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('generates multiple UUIDs', () => {
    const uuids = generateMultipleUUIDs(5, 4);
    expect(uuids.length).toBe(5);
    uuids.forEach((uuid) => {
      expect(isValidUUID(uuid)).toBe(true);
    });
  });

  it('generates unique UUIDs', () => {
    const uuids = generateMultipleUUIDs(100, 4);
    const unique = new Set(uuids);
    expect(unique.size).toBe(100);
  });

  it('validates valid UUID', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('rejects invalid UUID', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false);
    expect(isValidUUID('')).toBe(false);
    expect(isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
  });

  it('has correct version names', () => {
    expect(uuidVersions.find(v => v.version === 1)?.name).toBe('时间戳版本');
    expect(uuidVersions.find(v => v.version === 4)?.name).toBe('随机版本');
  });

  it('defaults to v4', () => {
    const uuid = generateUUID();
    expect(isValidUUID(uuid)).toBe(true);
  });
});
