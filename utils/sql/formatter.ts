/**
 * SQL 格式化/压缩工具函数
 */

const INDENT = '  ';

// 关键字列表（按长度降序排列，避免短关键字先匹配）
const KEYWORDS = [
  'UNION ALL', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
  'FULL JOIN', 'CROSS JOIN', 'INSERT INTO', 'DELETE FROM',
  'ORDER BY', 'GROUP BY', 'UNION', 'SELECT', 'FROM', 'WHERE',
  'AND', 'OR', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'ON',
  'VALUES', 'UPDATE', 'SET', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
];

// 判断字符是否为字母或数字
const isAlphanumeric = (char: string): boolean => {
  return /[a-zA-Z0-9]/.test(char);
};

/**
 * 格式化 SQL 语句
 * 为 SQL 代码添加适当的缩进和换行，提高可读性
 */
export function sqlFormat(input: string): string {
  // 预处理：移除注释
  let sql = input
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // 规范化空白
  sql = sql.replace(/\s+/g, ' ').trim();
  if (!sql) return '';

  // Tokenize: 将 SQL 拆分成关键字+内容的片段
  const tokens: string[] = [];
  let i = 0;
  const sqlUpper = sql.toUpperCase();

  while (i < sql.length) {
    let matched = false;

    // 尝试匹配关键字（按长度降序）
    for (const keyword of KEYWORDS) {
      const kwUpper = keyword.toUpperCase();
      const kwLen = kwUpper.length;
      // 检查关键字是否匹配
      if (sqlUpper.substring(i, i + kwLen) === kwUpper) {
        // 检查前一个字符（如果是开始位置则跳过）
        const prevChar = i > 0 ? sql[i - 1] : ' ';
        // 检查后一个字符（如果是结束位置则跳过）
        const nextChar = (i + kwLen < sql.length) ? sql[i + kwLen] : ' ';
        // 确保前后都不是字母数字，避免匹配单词的一部分
        if (!isAlphanumeric(prevChar) && !isAlphanumeric(nextChar)) {
          // 找到关键字，收集到行末或下一个关键字
          let j = i + kwLen;
          let content = '';
          while (j < sql.length) {
            // 检查是否遇到下一个关键字
            let nextKwFound = false;
            for (const nextKeyword of KEYWORDS) {
              const nextKwUpper = nextKeyword.toUpperCase();
              const nextKwLen = nextKwUpper.length;
              // 检查下一个关键字的位置
              if (sqlUpper.substring(j, j + nextKwLen) === nextKwUpper) {
                const prevCharBeforeKw = j > 0 ? sql[j - 1] : ' ';
                const nextCharAfterKw = (j + nextKwLen < sql.length) ? sql[j + nextKwLen] : ' ';
                if (!isAlphanumeric(prevCharBeforeKw) && !isAlphanumeric(nextCharAfterKw)) {
                  nextKwFound = true;
                  break;
                }
              }
            }
            if (nextKwFound) {
              // 遇到下一个关键字，检查前面是否有空格需要跳过
              if (content.endsWith(' ')) {
                // 移除末尾空格
                content = content.trimEnd();
              }
              break;
            }
            content += sql[j];
            j++;
          }
          // 只在有关联内容时添加空格
          const tokenContent = content.trim();
          tokens.push(tokenContent ? `${keyword} ${tokenContent}` : keyword);
          i = j;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      // 收集非关键字字符
      let j = i;
      while (j < sql.length) {
        let kwFound = false;
        for (const kw of KEYWORDS) {
          const kwUpper = kw.toUpperCase();
          const kwLen = kwUpper.length;
          if (sqlUpper.substring(j, j + kwLen) === kwUpper) {
            const prevCharBeforeKw = j > 0 ? sql[j - 1] : ' ';
            const nextCharAfterKw = (j + kwLen < sql.length) ? sql[j + kwLen] : ' ';
            if (!isAlphanumeric(prevCharBeforeKw) && !isAlphanumeric(nextCharAfterKw)) {
              kwFound = true;
              break;
            }
          }
        }
        if (kwFound) break;
        j++;
      }
      if (j > i) {
        tokens.push(sql.substring(i, j).trim());
      }
      i = j;
    }
  }

  // 构建带缩进的结果
  const result: string[] = [];
  let indentLevel = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const upperToken = token.toUpperCase().split(' ')[0];

    // 根据关键字调整缩进
    if (upperToken === 'UNION') {
      // UNION 回到顶级
      indentLevel = 0;
      result.push(token);
    } else if (upperToken === 'CASE') {
      // CASE 语句需要嵌套
      result.push(INDENT.repeat(indentLevel) + token);
      indentLevel++;
    } else if (upperToken === 'END') {
      // 结束嵌套
      indentLevel = Math.max(0, indentLevel - 1);
      result.push(INDENT.repeat(indentLevel) + token);
    } else if (upperToken === 'SELECT' || upperToken === 'INSERT' ||
               upperToken === 'UPDATE' || upperToken === 'DELETE') {
      // 主关键字在基础级别
      result.push(INDENT.repeat(indentLevel) + token);
    } else if (upperToken.startsWith('JOIN')) {
      // JOIN 在基础级别
      result.push(INDENT.repeat(indentLevel) + token);
    } else if (upperToken === 'FROM' || upperToken === 'WHERE' || upperToken === 'SET' ||
               upperToken === 'VALUES' || upperToken === 'HAVING' || upperToken === 'LIMIT' ||
               upperToken === 'OFFSET' || upperToken === 'GROUP BY' || upperToken === 'ORDER BY') {
      // 子句关键字在基础级别
      result.push(INDENT.repeat(indentLevel) + token);
    } else if (upperToken === 'AND' || upperToken === 'OR' || upperToken === 'ON' ||
               upperToken === 'WHEN' || upperToken === 'THEN' || upperToken === 'ELSE') {
      // 条件关键字在基础级别
      result.push(INDENT.repeat(indentLevel) + token);
    } else {
      // 其他内容在当前级别
      result.push(INDENT.repeat(indentLevel) + token);
    }
  }

  return result.join('\n');
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
