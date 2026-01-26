import { describe, it, expect } from 'vitest';
import { htmlFormat, htmlMinify } from '../../utils/string/html';

describe('HTML Utils', () => {
  it('formats basic HTML', () => {
    const input = '<div><span>Hello</span></div>';
    const result = htmlFormat(input);
    expect(result).toContain('<div>');
    expect(result).toContain('<span>');
    expect(result).toContain('\n');
  });

  it('minifies HTML', () => {
    const input = '<div>  </div>';
    const result = htmlMinify(input);
    expect(result).toBe('<div></div>');
  });

  it('removes whitespace between tags in minify', () => {
    const input = '<div></div><span></span>';
    const result = htmlMinify(input);
    expect(result).toBe('<div></div><span></span>');
  });

  it('handles empty input', () => {
    expect(htmlFormat('')).toBe('');
    expect(htmlMinify('')).toBe('');
  });

  it('handles self-closing tags', () => {
    const input = '<img src="test.jpg"/><br/><input type="text"/>';
    const formatted = htmlFormat(input);
    expect(formatted).toContain('<img');
    expect(formatted).toContain('<br');
    expect(formatted).toContain('<input');
  });
});
