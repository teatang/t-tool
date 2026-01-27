/**
 * 正则表达式测试/替换工具函数
 */

/** 正则匹配结果接口 */
export interface RegexMatch {
  match: string;      // 匹配的文本
  index: number;      // 匹配的起始位置
  groups?: string[];  // 捕获组
}

// 检测可能导致回溯死循环的危险模式
const DANGEROUS_PATTERNS = [
  /\([^)]*\)\+/,           // 捕获组后跟 + (如 (abc)+ )
  /\([^)]*\)\*/,           // 捕获组后跟 *
  /\([^|]*\|[^)]*\)\+/,    // 选择结构后跟量词 (a|b)+
  /\([^|]*\|[^)]*\)\*/,    // 选择结构后跟 *
];

// 超时时间（毫秒）
const TIMEOUT_MS = 500;

/**
 * 测试正则表达式匹配
 * 在文本中查找所有匹配项
 * @param pattern 正则表达式模式
 * @param flags 正则标志（g: 全局, i: 忽略大小写, m: 多行）
 * @param text 要匹配的文本
 * @returns 匹配结果数组和可能的错误信息
 */
export function regexTest(pattern: string, flags: string, text: string): {
  matches: RegexMatch[];
  error?: string;
} {
  // 快速检查空模式
  if (!pattern) {
    return { matches: [] };
  }

  // 检测危险模式（可能导致指数级回溯）
  for (const dangerous of DANGEROUS_PATTERNS) {
    if (dangerous.test(pattern)) {
      return { matches: [], error: 'Potentially dangerous pattern detected (possible exponential backtracking)' };
    }
  }

  // 检测简单危险模式（开头是量词）
  const trimmedPattern = pattern.replace(/^\^/, '').trim();
  if (/^[\*\+\?]/.test(trimmedPattern)) {
    return { matches: [], error: 'Invalid regular expression: nothing to repeat' };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match;
    let iterations = 0;
    const MAX_ITERATIONS = 100000;

    // 使用时间超时保护
    const startTime = Date.now();

    while ((match = regex.exec(text)) !== null) {
      // 检查超时
      if (Date.now() - startTime > TIMEOUT_MS) {
        return { matches, error: 'Execution timed out' };
      }

      iterations++;
      if (iterations > MAX_ITERATIONS) {
        return { matches, error: 'Too many matches' };
      }
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1).map((g) => g || ''),
      });

      // 防止零长度无限匹配
      if (match.index === regex.lastIndex && match[0].length === 0) {
        regex.lastIndex++;
        if (regex.lastIndex > text.length) break;
      }
    }

    return { matches };
  } catch (e) {
    return { matches: [], error: (e as Error).message };
  }
}

/**
 * 使用正则表达式替换文本
 * @param pattern 正则表达式模式
 * @param replacement 替换文本（可使用 $1, $2 等引用捕获组）
 * @param flags 正则标志
 * @param text 原始文本
 * @returns 替换后的结果和可能的错误信息
 */
export function regexReplace(pattern: string, replacement: string, flags: string, text: string): {
  result: string;
  error?: string;
} {
  // 快速检查空模式
  if (!pattern) {
    return { result: text };
  }

  // 检测危险模式
  for (const dangerous of DANGEROUS_PATTERNS) {
    if (dangerous.test(pattern)) {
      return { result: text, error: 'Potentially dangerous pattern detected' };
    }
  }

  // 检测简单危险模式
  const trimmedPattern = pattern.replace(/^\^/, '').trim();
  if (/^[\*\+\?]/.test(trimmedPattern)) {
    return { result: text, error: 'Invalid regular expression: nothing to repeat' };
  }

  try {
    const regex = new RegExp(pattern, flags);
    return { result: text.replace(regex, replacement) };
  } catch (e) {
    return { result: text, error: (e as Error).message };
  }
}

/**
 * 验证正则表达式模式
 * 检查模式是否有效
 * @param pattern 要验证的正则表达式模式
 * @returns 验证结果，包含是否有效和可能的错误信息
 */
export function regexGetPatternInfo(pattern: string): {
  isValid: boolean;
  error?: string;
} {
  // 快速检查空模式
  if (!pattern) {
    return { isValid: false, error: 'Empty pattern' };
  }

  // 检测危险模式
  for (const dangerous of DANGEROUS_PATTERNS) {
    if (dangerous.test(pattern)) {
      return { isValid: false, error: 'Potentially dangerous pattern detected' };
    }
  }

  // 检测简单危险模式
  const trimmedPattern = pattern.replace(/^\^/, '').trim();
  if (/^[\*\+\?]/.test(trimmedPattern)) {
    return { isValid: false, error: 'Invalid regular expression: nothing to repeat' };
  }

  try {
    new RegExp(pattern);
    return { isValid: true };
  } catch (e) {
    return { isValid: false, error: (e as Error).message };
  }
}
