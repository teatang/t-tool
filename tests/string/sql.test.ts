import { describe, it, expect } from 'vitest';
import { sqlFormat, sqlMinify } from '../../utils/sql/formatter';

describe('SQL Formatter', () => {
  describe('sqlFormat', () => {
    it('formats basic SELECT statement', () => {
      const input = 'SELECT * FROM users';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users');
    });

    it('formats WHERE clause', () => {
      const input = 'SELECT * FROM users WHERE id = 1';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users\nWHERE id = 1');
    });

    it('formats AND condition', () => {
      const input = 'SELECT * FROM users WHERE id = 1 AND status = 1';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users\nWHERE id = 1\nAND status = 1');
    });

    it('formats with multiple keywords', () => {
      const input = 'SELECT * FROM users WHERE display = 1 AND status = 1 LIMIT 100';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users\nWHERE display = 1\nAND status = 1\nLIMIT 100');
    });

    it('formats INSERT statement', () => {
      const input = 'INSERT INTO users VALUES (1, "test")';
      const result = sqlFormat(input);
      expect(result).toBe('INSERT INTO users\nVALUES (1, "test")');
    });

    it('formats UPDATE statement', () => {
      const input = 'UPDATE users SET name = "test" WHERE id = 1';
      const result = sqlFormat(input);
      expect(result).toBe('UPDATE users\nSET name = "test"\nWHERE id = 1');
    });

    it('formats JOIN statement', () => {
      const input = 'SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users\nLEFT JOIN orders\nON users.id = orders.user_id');
    });

    it('formats empty string', () => {
      expect(sqlFormat('')).toBe('');
    });

    it('removes single-line comments', () => {
      const input = 'SELECT * FROM users -- comment';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users');
    });

    it('removes multi-line comments', () => {
      const input = 'SELECT * FROM users /* comment */';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users');
    });

    it('handles ORDER BY and GROUP BY', () => {
      const input = 'SELECT status FROM users GROUP BY status ORDER BY status';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT status\nFROM users\nGROUP BY status\nORDER BY status');
    });

    it('converts keywords to uppercase', () => {
      const input = 'select * from users where id = 1';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM users\nWHERE id = 1');
    });

    it('formats complex query with multiple JOINs', () => {
      const input = 'SELECT a.id, b.name FROM users a LEFT JOIN orders b ON a.id = b.user_id INNER JOIN products c ON b.product_id = c.id WHERE a.status = 1';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT a.id, b.name\nFROM users a\nLEFT JOIN orders b\nON a.id = b.user_id\nINNER JOIN products c\nON b.product_id = c.id\nWHERE a.status = 1');
    });

    it('formats UNION statement', () => {
      const input = 'SELECT id FROM active_users UNION SELECT id FROM blocked_users';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT id\nFROM active_users\nUNION\nSELECT id\nFROM blocked_users');
    });

    it('formats CASE statement', () => {
      const input = 'SELECT name, CASE WHEN status = 1 THEN "active" ELSE "inactive" END AS status_text FROM users';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT name,\nCASE\n  WHEN status = 1\n  THEN "active"\n  ELSE "inactive"\nEND AS status_text\nFROM users');
    });
  });

  describe('sqlMinify', () => {
    it('minifies basic SQL', () => {
      const input = 'SELECT  *  FROM  users';
      expect(sqlMinify(input)).toBe('SELECT * FROM users');
    });

    it('removes newlines', () => {
      const input = 'SELECT\n*\nFROM\nusers';
      expect(sqlMinify(input)).toBe('SELECT * FROM users');
    });

    it('removes comments', () => {
      const input = 'SELECT * FROM users -- comment';
      expect(sqlMinify(input)).toBe('SELECT * FROM users');
    });

    it('removes multi-line comments', () => {
      const input = 'SELECT * FROM users /* comment */';
      expect(sqlMinify(input)).toBe('SELECT * FROM users');
    });

    it('removes spaces around operators', () => {
      const input = 'WHERE id = 1 AND status = 1';
      expect(sqlMinify(input)).toBe('WHERE id=1 AND status=1');
    });

    it('handles empty string', () => {
      expect(sqlMinify('')).toBe('');
    });

    it('preserves string content', () => {
      const input = "SELECT * FROM users WHERE name = 'John Doe'";
      expect(sqlMinify(input)).toBe("SELECT * FROM users WHERE name='John Doe'");
    });
  });
});
