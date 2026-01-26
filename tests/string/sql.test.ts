import { describe, it, expect } from 'vitest';
import { sqlFormat, sqlMinify } from '../../utils/sql/formatter';

describe('SQL Formatter', () => {
  describe('sqlFormat', () => {
    it('formats basic SELECT statement', () => {
      const input = 'SELECT * FROM users';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM\nusers');
    });

    it('formats WHERE clause', () => {
      const input = 'SELECT * FROM users WHERE id = 1';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM\nusers\nWHERE\nid = 1');
    });

    it('formats AND condition', () => {
      const input = 'SELECT * FROM users WHERE id = 1 AND status = 1';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM\nusers\nWHERE\nid = 1\nAND\nstatus = 1');
    });

    it('formats with multiple keywords', () => {
      const input = 'SELECT * FROM users WHERE dispaly = 1 AND status = 1 LIMIT 100';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM\nusers\nWHERE\ndispaly = 1\nAND\nstatus = 1\nLIMIT\n100');
    });

    it('formats INSERT statement', () => {
      const input = 'INSERT INTO users VALUES (1, "test")';
      const result = sqlFormat(input);
      expect(result).toBe('INSERT INTO users\nVALUES\n(1, "test")');
    });

    it('formats UPDATE statement', () => {
      const input = 'UPDATE users SET name = "test" WHERE id = 1';
      const result = sqlFormat(input);
      expect(result).toBe('UPDATE users\nSET\nname = "test"\nWHERE\nid = 1');
    });

    it('formats JOIN statement', () => {
      const input = 'SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM\nusers\nLEFT JOIN\norders\nON\nusers.id = orders.user_id');
    });

    it('formats empty string', () => {
      expect(sqlFormat('')).toBe('');
    });

    it('removes single-line comments', () => {
      const input = 'SELECT * FROM users -- comment';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM\nusers');
    });

    it('removes multi-line comments', () => {
      const input = 'SELECT * FROM users /* comment */';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT *\nFROM\nusers');
    });

    it('handles ORDER BY and GROUP BY', () => {
      const input = 'SELECT status FROM users GROUP BY status ORDER BY status';
      const result = sqlFormat(input);
      expect(result).toBe('SELECT status\nFROM\nusers\nGROUP BY\nstatus\nORDER BY\nstatus');
    });

    it('preserves keyword case', () => {
      const input = 'select * from users where id = 1';
      const result = sqlFormat(input);
      expect(result).toBe('select *\nFROM\nusers\nWHERE\nid = 1');
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
