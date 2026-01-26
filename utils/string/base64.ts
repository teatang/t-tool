/**
 * Base64 编码/解码工具函数
 */

/**
 * 将字符串编码为 Base64 格式
 * @param input 输入字符串
 * @returns Base64 编码结果
 */
export function base64Encode(input: string): string {
  if (!input) return '';
  return Buffer.from(input, 'utf-8').toString('base64');
}

/**
 * 将 Base64 字符串解码为原始字符串
 * @param input Base64 编码字符串
 * @returns 解码后的原始字符串，如果输入无效则返回错误信息
 */
export function base64Decode(input: string): string {
  if (!input) return '';
  try {
    const decoded = Buffer.from(input, 'base64').toString('utf-8');
    // 验证是否为有效的 Base64 字符
    if (!input.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
      return '无效的 Base64 输入';
    }
    return decoded;
  } catch {
    return '无效的 Base64 输入';
  }
}
