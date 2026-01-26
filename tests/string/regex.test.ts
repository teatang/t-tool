import { describe, it, expect } from 'vitest';
import { regexTest, regexReplace, regexGetPatternInfo } from '../../utils/string/regex';

describe('Regex Utils', () => {
  it('tests valid pattern', () => {
    const result = regexTest('\\w+', 'g', 'Hello World');
    expect(result.matches.length).toBe(2);
    expect(result.matches[0].match).toBe('Hello');
    expect(result.matches[1].match).toBe('World');
  });

  it('returns empty matches for no matches', () => {
    const result = regexTest('\\d+', 'g', 'No numbers here');
    expect(result.matches.length).toBe(0);
  });

  it('captures groups', () => {
    const result = regexTest('(\\w+)@(\\w+)\\.com', 'g', 'test@example.com');
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].groups).toBeDefined();
    expect(result.matches[0].groups?.length).toBe(2);
    expect(result.matches[0].groups?.[0]).toBe('test');
    expect(result.matches[0].groups?.[1]).toBe('example');
  });

  it('handles invalid pattern', () => {
    const result = regexTest('[unclosed', 'g', 'test');
    expect(result.error).toBeDefined();
  });

  it('replaces matched text', () => {
    const result = regexReplace('\\d+', '[NUM]', 'g', 'abc123def456');
    expect(result.result).toBe('abc[NUM]def[NUM]');
  });

  it('replaces with capture groups', () => {
    const result = regexReplace('(\\w+)@(\\w+)\\.com', '$1 at $2 dot com', 'g', 'test@example.com');
    expect(result.result).toBe('test at example dot com');
  });

  it('validates valid pattern', () => {
    const result = regexGetPatternInfo('\\w+');
    expect(result.isValid).toBe(true);
  });

  it('validates invalid pattern', () => {
    const result = regexGetPatternInfo('[invalid');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
