/**
 * 时间戳转换工具函数
 */

/** 时间戳转换结果接口 */
export interface TimestampResult {
  unix: number;       // Unix 时间戳（毫秒）
  iso: string;        // ISO 8601 格式
  utc: string;        // UTC 时间字符串
  local: string;      // 本地时间字符串
  formatted: string;  // 格式化时间 "YYYY-MM-DD HH:mm:ss"
}

/**
 * 将时间戳转换为多种日期格式
 * @param timestamp Unix 时间戳（毫秒）
 * @returns 包含各种格式的时间结果对象
 */
export function timestampToDate(timestamp: number): TimestampResult {
  const date = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return {
    unix: timestamp,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    formatted,
  };
}

/**
 * 将日期字符串转换为时间戳
 * @param dateStr 日期字符串（支持多种格式）
 * @returns 转换结果，包含成功状态、时间戳结果或错误信息
 */
export function dateToTimestamp(dateStr: string): { success: boolean; result?: TimestampResult; error?: string } {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { success: false, error: '无效的日期格式' };
  }
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return {
    success: true,
    result: {
      unix: date.getTime(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      formatted,
    },
  };
}

/**
 * 获取当前时间戳
 * @returns 当前时间的时间戳结果
 */
export function getCurrentTimestamp(): TimestampResult {
  return timestampToDate(Date.now());
}

/**
 * 格式化时长
 * 将毫秒转换为人类可读的时间格式
 * @param ms 毫秒数
 * @returns 格式化后的时间字符串（如 1.50s, 2.30m）
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}m`;
  if (ms < 86400000) return `${(ms / 3600000).toFixed(2)}h`;
  return `${(ms / 86400000).toFixed(2)}d`;
}
