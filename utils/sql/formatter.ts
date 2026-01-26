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
    'HAVING', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'FULL JOIN', 'CROSS JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
    'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'INDEX', 'UNION', 'UNION ALL', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'IN',
    'NOT IN', 'IS NULL', 'IS NOT NULL', 'LIKE', 'BETWEEN', 'EXISTS',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RECURSIVE',
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT', 'DEFAULT',
    'NOT NULL', 'UNIQUE', 'CHECK', 'CASCADE', 'TEMPORARY', 'TABLE',
  ];

  let result = input;

  // 预处理：移除注释
  result = result.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

  // 在每个关键字前后添加换行符
  keywords.forEach((keyword) => {
    const regex = new RegExp('\\s+' + keyword + '\\s+', 'gi');
    result = result.replace(regex, '\n' + keyword + '\n');
  });

  // 处理换行后的清理
  const lines = result.split('\n');
  const formattedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    formattedLines.push(trimmed);
  }

  return formattedLines.join('\n');
}

/**
 * 压缩 SQL 语句
 * 移除不必要的空白字符，减小文件体积
 * @param input SQL 字符串
 * @returns 压缩后的 SQL 字符串
 */
export function sqlMinify(input: string): string {
  return input
    .replace(/--[^\n]*/g, '')           // 移除单行注释
    .replace(/\/\*[\s\S]*?\*\//g, '')   // 移除多行注释
    .replace(/\s+/g, ' ')               // 多余空白合并
    .replace(/\s*,\s*/g, ',')           // 逗号周围空白移除
    .replace(/\s*;\s*/g, ';')           // 分号周围空白移除
    .replace(/\s*\(\s*/g, '(')          // 左括号周围空白移除
    .replace(/\s*\)\s*/g, ')')          // 右括号周围空白移除
    .replace(/\s*=\s*/g, '=')           // 等号周围空白移除
    .replace(/\s*<>\s*/g, '<>')         // <> 周围空白移除
    .replace(/\s*!=\s*/g, '!=')         // != 周围空白移除
    .replace(/\s*<=\s*/g, '<=')         // <= 周围空白移除
    .replace(/\s*>=\s*/g, '>=')         // >= 周围空白移除
    .replace(/\s*<\s*/g, '<')           // < 周围空白移除
    .replace(/\s*>\s*/g, '>')           // > 周围空白移除
    .trim();
}
