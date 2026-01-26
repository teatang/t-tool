/**
 * JSON 格式化/压缩/验证工具函数
 */

/**
 * 格式化 JSON 字符串
 * 将 JSON 字符串美化为易读格式（缩进 2 空格）
 * @param input JSON 字符串
 * @returns 格式化结果，包含格式化后的字符串和可能的错误信息
 */
export function jsonFormat(input: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { result: input, error: (e as Error).message };
  }
}

/**
 * 压缩 JSON 字符串
 * 将 JSON 字符串压缩为最小化格式（无缩进、无换行）
 * @param input JSON 字符串
 * @returns 压缩结果，包含压缩后的字符串和可能的错误信息
 */
export function jsonMinify(input: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed) };
  } catch (e) {
    return { result: input, error: (e as Error).message };
  }
}

/**
 * 验证 JSON 字符串
 * 检查字符串是否为有效的 JSON 格式
 * @param input 要验证的字符串
 * @returns 验证结果，包含是否有效和可能的错误信息
 */
export function jsonValidate(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
