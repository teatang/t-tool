import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode } from '../../utils/string/base64';

describe('Base64 Utils', () => {
  it('encodes basic string', () => {
    expect(base64Encode('Hello')).toBe('SGVsbG8=');
  });

  it('encodes empty string', () => {
    expect(base64Encode('')).toBe('');
  });

  it('decodes basic base64', () => {
    expect(base64Decode('SGVsbG8=')).toBe('Hello');
  });

  it('decodes invalid base64', () => {
    expect(base64Decode('!!!invalid!!!')).toBe('无效的 Base64 输入');
  });

  it('round trip encoding/decoding', () => {
    const original = 'Test String 123!@#';
    const encoded = base64Encode(original);
    const decoded = base64Decode(encoded);
    expect(decoded).toBe(original);
  });

  it('encodes unicode characters', () => {
    const encoded = base64Encode('你好世界');
    expect(base64Decode(encoded)).toBe('你好世界');
  });
});
