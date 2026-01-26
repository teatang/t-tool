/**
 * URL 编码/解码工具函数
 */

/**
 * 对字符串进行 URL 编码
 * 将特殊字符转换为 %XX 格式
 * @param input 输入字符串
 * @returns URL 编码后的字符串
 */
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

/**
 * 对 URL 编码的字符串进行解码
 * 将 %XX 格式转换回原始字符
 * @param input URL 编码字符串
 * @returns 解码后的原始字符串，如果输入无效则返回错误信息
 */
export function urlDecode(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return '无效的 URL 编码输入';
  }
}
