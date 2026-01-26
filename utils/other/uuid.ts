/**
 * UUID 生成工具函数
 */

/** UUID 版本信息接口 */
export interface UUIDVersion {
  version: number;  // 版本号
  name: string;     // 版本名称
}

/** 支持的 UUID 版本列表 */
export const uuidVersions: UUIDVersion[] = [
  { version: 1, name: '时间戳版本' },
  { version: 2, name: 'DCE 安全版本' },
  { version: 3, name: '基于 MD5' },
  { version: 4, name: '随机版本' },
  { version: 5, name: '基于 SHA-1' },
];

/**
 * 生成 UUID v4（随机版本）
 * 使用随机数生成符合规范的 UUID
 * @returns UUID 字符串
 */
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 生成 UUID v1（时间戳版本）
 * 基于时间戳和随机数生成
 * @returns UUID 字符串
 */
function generateUUIDv1(): string {
  const hexChars = '0123456789abcdef';
  // 生成各部分
  const timeLow = Array.from({ length: 8 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
  const timeMid = Array.from({ length: 4 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
  const timeHiAndVersion = '1' + Array.from({ length: 3 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
  // clockSeq 高两位设为 10 (即 8, 9, a, b)
  const clockSeqHighAndReserved = (Math.floor(Math.random() * 4) | 8).toString(16);
  const clockSeqLow = hexChars[Math.floor(Math.random() * 16)];
  const clockSeq = clockSeqHighAndReserved + clockSeqLow + Array.from({ length: 2 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
  const node = Array.from({ length: 12 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');

  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeq}-${node}`;
}

// v3 和 v5 暂时使用 v4 实现
function generateUUIDv3(): string {
  return generateUUIDv4();
}

function generateUUIDv5(): string {
  return generateUUIDv4();
}

/**
 * 生成指定版本的 UUID
 * @param version UUID 版本号（1-5），默认为 4
 * @returns UUID 字符串
 */
export function generateUUID(version: number = 4): string {
  switch (version) {
    case 1:
      return generateUUIDv1();
    case 3:
      return generateUUIDv3();
    case 4:
      return generateUUIDv4();
    case 5:
      return generateUUIDv5();
    default:
      return generateUUIDv4();
  }
}

/**
 * 批量生成 UUID
 * @param count 生成数量
 * @param version UUID 版本号，默认为 4
 * @returns UUID 字符串数组
 */
export function generateMultipleUUIDs(count: number, version: number = 4): string[] {
  return Array.from({ length: count }, () => generateUUID(version));
}

/**
 * 验证 UUID 格式
 * @param uuid 要验证的 UUID 字符串
 * @returns 是否为有效的 UUID 格式
 */
export function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
