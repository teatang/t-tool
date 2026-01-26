import { describe, it, expect } from 'vitest';
import { urlEncode, urlDecode } from '../../utils/string/url';

describe('URL Utils', () => {
  it('encodes basic string', () => {
    expect(urlEncode('hello world')).toBe('hello%20world');
  });

  it('encodes special characters', () => {
    expect(urlEncode('a=b&c=d')).toBe('a%3Db%26c%3Dd');
  });

  it('encodes unicode', () => {
    expect(urlEncode('你好')).toBe('%E4%BD%A0%E5%A5%BD');
  });

  it('decodes basic encoded string', () => {
    expect(urlDecode('hello%20world')).toBe('hello world');
  });

  it('decodes special characters', () => {
    expect(urlDecode('a%3Db%26c%3Dd')).toBe('a=b&c=d');
  });

  it('round trip encoding/decoding', () => {
    const original = 'https://example.com/path?query=value&other=123';
    const encoded = urlEncode(original);
    const decoded = urlDecode(encoded);
    expect(decoded).toBe(original);
  });

  it('decodes unicode', () => {
    expect(urlDecode('%E4%BD%A0%E5%A5%BD')).toBe('你好');
  });
});
