/**
 * HTML 格式化/压缩工具函数
 */

/**
 * 格式化 HTML 字符串
 * 为 HTML 代码添加缩进和换行，提高可读性
 * @param input HTML 字符串
 * @returns 格式化后的 HTML 字符串
 */
export function htmlFormat(input: string): string {
  let formatted = '';
  let indent = 0;
  const tab = '  ';  // 使用两个空格作为缩进

  // 按标签分割处理
  input.split(/>\s*</).forEach((element) => {
    // 遇到闭合标签时减少缩进
    if (element.match(/^\/\w/)) {
      indent -= tab.length;
    }

    formatted += tab.repeat(indent) + '<' + element + '>\r\n';

    // 遇到开始标签且不是自闭合标签时增加缩进
    if (element.match(/^<?\w[^>]*[^\/]$/) &&
        !element.startsWith('input') &&
        !element.startsWith('img') &&
        !element.startsWith('br')) {
      indent += tab.length;
    }
  });

  // 去掉首尾多余的字符
  return formatted.substring(1, formatted.length - 3);
}

/**
 * 压缩 HTML 字符串
 * 移除不必要的空白字符，减小文件体积
 * @param input HTML 字符串
 * @returns 压缩后的 HTML 字符串
 */
export function htmlMinify(input: string): string {
  return input
    .replace(/\s+/g, ' ')           // 多个空白字符合并为一个
    .replace(/>\s+</g, '><')        // 标签之间的空白移除
    .replace(/\s*=\s*/g, '=')       // 属性值周围的空白移除
    .trim();
}
