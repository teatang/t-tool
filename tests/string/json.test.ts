import { describe, it, expect } from 'vitest';
import { jsonFormat, jsonMinify, jsonValidate } from '../../utils/string/json';

describe('JSON Utils', () => {
  it('formats valid JSON', () => {
    const input = '{"name":"test","value":123}';
    const result = jsonFormat(input);
    expect(result.result).toContain('"name": "test"');
    expect(result.result).toContain('\n');
  });

  it('returns error for invalid JSON', () => {
    const input = '{invalid json}';
    const result = jsonFormat(input);
    expect(result.error).toBeDefined();
  });

  it('minifies valid JSON', () => {
    const input = '{"name": "test", "value": 123}';
    const result = jsonMinify(input);
    expect(result.result).toBe('{"name":"test","value":123}');
  });

  it('validates valid JSON', () => {
    const input = '{"name": "test"}';
    const result = jsonValidate(input);
    expect(result.valid).toBe(true);
  });

  it('validates invalid JSON', () => {
    const input = '{invalid}';
    const result = jsonValidate(input);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('handles nested objects', () => {
    const input = JSON.stringify({ outer: { inner: 'value' } });
    const formatted = jsonFormat(input);
    expect(formatted.error).toBeUndefined();
    expect(formatted.result).toContain('outer');
    expect(formatted.result).toContain('inner');
  });

  it('handles arrays', () => {
    const input = JSON.stringify([1, 2, 3]);
    const formatted = jsonFormat(input);
    expect(formatted.error).toBeUndefined();
  });
});
