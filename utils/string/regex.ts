/**
 * 正则表达式测试/替换工具函数
 */

/** 正则匹配结果接口 */
export interface RegexMatch {
  match: string;      // 匹配的文本
  index: number;      // 匹配的起始位置
  groups?: string[];  // 捕获组
}

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
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1).map((g) => g || ''),
      });
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
  try {
    new RegExp(pattern);
    return { isValid: true };
  } catch (e) {
    return { isValid: false, error: (e as Error).message };
  }
}
