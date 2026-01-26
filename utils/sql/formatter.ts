/**
 * SQL 格式化/压缩工具函数
 */

/**
 * 格式化 SQL 语句
 * 为 SQL 代码添加适当的缩进和换行，提高可读性
 * @param input SQL 字符串
 * @returns 格式化后的 SQL 字符串
 */
export function sqlFormat(input: string): string {
  // SQL 关键字列表，用于识别和换行
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY',
    'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'OUTER JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
    'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'INDEX', 'UNION', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'IN',
    'NOT IN', 'IS NULL', 'IS NOT NULL', 'LIKE', 'BETWEEN', 'INNER',
    'LEFT', 'RIGHT', 'OUTER', 'CROSS', 'NATURAL', 'PRIMARY KEY',
    'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT', 'DEFAULT', 'NULL',
    'NOT NULL', 'UNIQUE', 'CHECK', 'CASCADE', 'WITH', 'RECURSIVE',
  ];

  let formatted = input;
  let result = '';
  let indent = 0;
  const tab = '  ';      // 缩进字符
  const newline = '\n';  // 换行符

  // 在每个关键字前后添加换行
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, '\n' + keyword.toUpperCase() + '\n');
  });

  formatted = formatted.trim();

  // 处理括号和缩进
  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];

    if (char === '(') {
      // 左括号后换行并增加缩进
      result += char + newline + tab.repeat(++indent);
    } else if (char === ')') {
      // 右括号前换行并减少缩进
      result += newline + tab.repeat(--indent) + char;
    } else {
      result += char;
    }
  }

  // 后处理：清理多余空白，格式化逗号和分号
  result = result
    .replace(/^\n/, '')
    .replace(/\n\s+/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ',\n' + tab.repeat(indent))
    .replace(/;\s*/g, ';\n');

  return result.trim();
}

/**
 * 压缩 SQL 语句
 * 移除不必要的空白字符，减小文件体积
 * @param input SQL 字符串
 * @returns 压缩后的 SQL 字符串
 */
export function sqlMinify(input: string): string {
  return input
    .replace(/\s+/g, ' ')           // 多余空白合并
    .replace(/\s*,\s*/g, ',')       // 逗号周围空白移除
    .replace(/\s*;\s*/g, ';')       // 分号周围空白移除
    .replace(/\s*\(\s*/g, '(')      // 左括号周围空白移除
    .replace(/\s*\)\s*/g, ')')      // 右括号周围空白移除
    .replace(/\s*=\s*/g, '=')       // 等号周围空白移除
    .replace(/\s*<>\s*/g, '<>')     // <> 周围空白移除
    .replace(/\s*!=\s*/g, '!=')     // != 周围空白移除
    .trim();
}
