import { stringify } from 'yaml';

/**
 * Mihomo (Clash Meta) VLESS 节点配置接口
 */
export interface VlessProxyConfig {
  name: string;
  type: 'vless';
  server: string;
  port: number;
  uuid: string;
  network?: string;
  tls?: boolean;
  udp?: boolean;
  flow?: string;
  servername?: string;
  'client-fingerprint'?: string;
  'skip-cert-verify'?: boolean;
  alpn?: string[];
  'reality-opts'?: {
    'public-key'?: string;
    'short-id'?: string;
  };
  'ws-opts'?: {
    path?: string;
    headers?: Record<string, string>;
  };
  'grpc-opts'?: {
    'grpc-service-name'?: string;
  };
  'h2-opts'?: {
    path?: string;
    host?: string[];
  };
  [key: string]: unknown;
}

export interface ParseVlessResult {
  proxies: VlessProxyConfig[];
  errors: string[];
}

/**
 * 解析单条 VLESS 链接
 * @param rawUrl VLESS URL 字符串
 * @returns Mihomo 节点对象
 */
export function parseVlessUrl(rawUrl: string): VlessProxyConfig {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error('VLESS URL 不能为空');
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`无效的 URL 格式: ${trimmed}`);
  }

  if (parsed.protocol !== 'vless:') {
    throw new Error(`非 VLESS 协议链接: ${parsed.protocol}`);
  }

  const uuid = parsed.username;
  if (!uuid) {
    throw new Error('未找到 UUID');
  }

  const server = parsed.hostname;
  if (!server) {
    throw new Error('未找到服务器地址');
  }

  const port = parseInt(parsed.port, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(`无效的端口号: ${parsed.port}`);
  }

  // 节点名称：优先从 hash 解析，缺省为 server:port
  let name = '';
  if (parsed.hash) {
    try {
      name = decodeURIComponent(parsed.hash.replace(/^#/, '')).trim();
    } catch {
      name = parsed.hash.replace(/^#/, '').trim();
    }
  }
  if (!name) {
    name = `${server}:${port}`;
  }

  const searchParams = parsed.searchParams;
  const rawType = (searchParams.get('type') || 'tcp').toLowerCase();
  const security = (searchParams.get('security') || 'none').toLowerCase();
  const sni = searchParams.get('sni') || searchParams.get('serverName');
  const flow = searchParams.get('flow');
  const fp = searchParams.get('fp') || searchParams.get('client-fingerprint');
  const alpn = searchParams.get('alpn');
  const insecure = searchParams.get('insecure') || searchParams.get('allowInsecure');

  const proxy: VlessProxyConfig = {
    name,
    type: 'vless',
    server,
    port,
    uuid,
    udp: true,
  };

  // 网络传输层协议映射
  let network = 'tcp';
  if (rawType === 'ws' || rawType === 'websocket') {
    network = 'ws';
  } else if (rawType === 'grpc') {
    network = 'grpc';
  } else if (rawType === 'http' || rawType === 'h2') {
    network = 'h2';
  } else {
    network = rawType;
  }
  if (network !== 'tcp') {
    proxy.network = network;
  }

  // TLS & Reality
  if (security === 'tls' || security === 'reality') {
    proxy.tls = true;
  }

  if (sni) {
    proxy.servername = sni;
  }

  if (flow) {
    proxy.flow = flow;
  }

  if (fp) {
    proxy['client-fingerprint'] = fp;
  }

  if (alpn) {
    proxy.alpn = alpn.split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (insecure === '1' || insecure === 'true') {
    proxy['skip-cert-verify'] = true;
  }

  // Reality 配置
  if (security === 'reality') {
    const pbk = searchParams.get('pbk');
    const sid = searchParams.get('sid');
    proxy['reality-opts'] = {};
    if (pbk) proxy['reality-opts']['public-key'] = pbk;
    if (sid) proxy['reality-opts']['short-id'] = sid;
  }

  // WebSocket 配置
  if (network === 'ws') {
    const rawPath = searchParams.get('path') || '/';
    let path = rawPath;
    try {
      path = decodeURIComponent(rawPath);
    } catch {
      // 保持原样
    }
    const host = searchParams.get('host') || sni || undefined;
    proxy['ws-opts'] = {
      path,
      ...(host ? { headers: { Host: host } } : {}),
    };
  }

  // gRPC 配置
  if (network === 'grpc') {
    const serviceName = searchParams.get('serviceName') || searchParams.get('service_name') || '';
    if (serviceName) {
      proxy['grpc-opts'] = {
        'grpc-service-name': serviceName,
      };
    }
  }

  // H2 配置
  if (network === 'h2') {
    const path = searchParams.get('path') || '/';
    const host = searchParams.get('host');
    proxy['h2-opts'] = {
      path,
      ...(host ? { host: [host] } : {}),
    };
  }

  return proxy;
}

/**
 * 批量解析多行 VLESS 链接
 * @param text 多行文本输入
 * @returns 节点列表和解析错误信息
 */
export function parseMultipleVless(text: string): ParseVlessResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const proxies: VlessProxyConfig[] = [];
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 忽略注释行
    if (line.startsWith('#') || line.startsWith('//')) {
      continue;
    }
    try {
      const proxy = parseVlessUrl(line);
      proxies.push(proxy);
    } catch (err) {
      errors.push(`第 ${i + 1} 行解析失败: ${(err as Error).message}`);
    }
  }

  return { proxies, errors };
}

/**
 * 将 VLESS 链接字符串转换为 Mihomo YAML
 * @param input 输入的多行或单行 VLESS 文本
 * @param mode 'proxies' (仅节点列表) 或 'full' (包含规则与策略组的完整配置)
 * @returns 生成的 YAML 文本、成功解析的节点数量以及错误提示
 */
export function vlessToMihomoYaml(
  input: string,
  mode: 'proxies' | 'full' = 'proxies'
): { yaml: string; count: number; errors: string[] } {
  const { proxies, errors } = parseMultipleVless(input);

  if (proxies.length === 0) {
    return {
      yaml: '',
      count: 0,
      errors: errors.length > 0 ? errors : ['未找到有效的 VLESS 节点链接'],
    };
  }

  if (mode === 'proxies') {
    const yaml = stringify({ proxies }, { indent: 2 });
    return { yaml, count: proxies.length, errors };
  }

  // full config 模式
  const proxyNames = proxies.map((p) => p.name);
  const fullConfig = {
    port: 7890,
    'socks-port': 7891,
    'mixed-port': 7890,
    'allow-lan': false,
    mode: 'rule',
    'log-level': 'info',
    ipv6: false,
    'external-controller': '127.0.0.1:9090',
    dns: {
      enable: true,
      listen: '0.0.0.0:1053',
      ipv6: false,
      'default-nameserver': ['223.5.5.5', '119.29.29.29'],
      'enhanced-mode': 'fake-ip',
      'fake-ip-range': '198.18.0.1/16',
      nameserver: [
        'https://dns.alidns.com/dns-query',
        'https://doh.pub/dns-query',
      ],
    },
    proxies,
    'proxy-groups': [
      {
        name: 'PROXY',
        type: 'select',
        proxies: ['AUTO', ...proxyNames],
      },
      {
        name: 'AUTO',
        type: 'url-test',
        url: 'https://www.gstatic.com/generate_204',
        interval: 300,
        proxies: [...proxyNames],
      },
    ],
    rules: [
      'GEOIP,LAN,DIRECT',
      'GEOIP,CN,DIRECT',
      'MATCH,PROXY',
    ],
  };

  const yaml = stringify(fullConfig, { indent: 2 });
  return { yaml, count: proxies.length, errors };
}
