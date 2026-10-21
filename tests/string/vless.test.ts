import { describe, it, expect } from 'vitest';
import { parseVlessUrl, parseMultipleVless, vlessToMihomoYaml } from '../../utils/string/vless';

describe('VLESS Parser and Mihomo YAML Generator', () => {
  it('should parse standard VLESS TCP TLS URL', () => {
    const url = 'vless://12345678-1234-1234-1234-123456789abc@example.com:443?security=tls&sni=example.com#Standard-Node';
    const proxy = parseVlessUrl(url);
    expect(proxy.name).toBe('Standard-Node');
    expect(proxy.type).toBe('vless');
    expect(proxy.server).toBe('example.com');
    expect(proxy.port).toBe(443);
    expect(proxy.uuid).toBe('12345678-1234-1234-1234-123456789abc');
    expect(proxy.tls).toBe(true);
    expect(proxy.servername).toBe('example.com');
    expect(proxy.udp).toBe(true);
  });

  it('should parse VLESS WS with custom path and host', () => {
    const url = 'vless://uuid-ws@ws.example.com:8443?type=ws&security=tls&path=%2Fchat&host=ws.example.com&sni=ws.example.com#WS-Node';
    const proxy = parseVlessUrl(url);
    expect(proxy.network).toBe('ws');
    expect(proxy['ws-opts']?.path).toBe('/chat');
    expect(proxy['ws-opts']?.headers?.Host).toBe('ws.example.com');
  });

  it('should parse VLESS Reality with pbk, sid, fp, and flow', () => {
    const url = 'vless://uuid-reality@reality.example.com:443?security=reality&pbk=pubkey123&sid=shortid123&fp=chrome&flow=xtls-rprx-vision&sni=yahoo.com#Reality-Node';
    const proxy = parseVlessUrl(url);
    expect(proxy.tls).toBe(true);
    expect(proxy.flow).toBe('xtls-rprx-vision');
    expect(proxy['client-fingerprint']).toBe('chrome');
    expect(proxy['reality-opts']?.['public-key']).toBe('pubkey123');
    expect(proxy['reality-opts']?.['short-id']).toBe('shortid123');
    expect(proxy.servername).toBe('yahoo.com');
  });

  it('should parse VLESS gRPC with serviceName', () => {
    const url = 'vless://uuid-grpc@grpc.example.com:443?type=grpc&security=tls&serviceName=my-grpc-service&sni=grpc.example.com#gRPC-Node';
    const proxy = parseVlessUrl(url);
    expect(proxy.network).toBe('grpc');
    expect(proxy['grpc-opts']?.['grpc-service-name']).toBe('my-grpc-service');
  });

  it('should parse URL-encoded node names and query parameters', () => {
    const url = 'vless://uuid-test@test.com:443?security=tls&path=%2Fmy%20path#%F0%9F%87%BA%F0%9F%87%B8%20US%20Node';
    const proxy = parseVlessUrl(url);
    expect(proxy.name).toBe('🇺🇸 US Node');
  });

  it('should fallback to host:port when node name hash is omitted', () => {
    const url = 'vless://uuid-test@test.com:443?security=tls';
    const proxy = parseVlessUrl(url);
    expect(proxy.name).toBe('test.com:443');
  });

  it('should parse alpn and skip-cert-verify', () => {
    const url = 'vless://uuid-test@test.com:443?security=tls&alpn=h2,http/1.1&insecure=1';
    const proxy = parseVlessUrl(url);
    expect(proxy.alpn).toEqual(['h2', 'http/1.1']);
    expect(proxy['skip-cert-verify']).toBe(true);
  });

  it('should throw an error for invalid VLESS URL', () => {
    expect(() => parseVlessUrl('http://example.com')).toThrow();
    expect(() => parseVlessUrl('vless://')).toThrow();
    expect(() => parseVlessUrl('vless://@example.com:443')).toThrow();
    expect(() => parseVlessUrl('vless://uuid@example.com:invalid-port')).toThrow();
    expect(() => parseVlessUrl('vless://uuid@example.com:99999')).toThrow();
  });

  it('should parse multiple links and handle invalid lines', () => {
    const input = `
      vless://uuid-1@s1.com:443?security=tls#Node1
      invalid-link
      vless://uuid-2@s2.com:80?type=ws#Node2
    `;
    const res = parseMultipleVless(input);
    expect(res.proxies).toHaveLength(2);
    expect(res.errors).toHaveLength(1);
    expect(res.proxies[0].name).toBe('Node1');
    expect(res.proxies[1].name).toBe('Node2');
  });

  it('should default to port 443 when port is omitted', () => {
    const url = 'vless://uuid-test@test.com?security=tls#DefaultPort';
    const proxy = parseVlessUrl(url);
    expect(proxy.port).toBe(443);
  });

  it('should ensure unique proxy names for duplicate node names in batch input', () => {
    const input = `
      vless://uuid-1@s1.com:443?security=tls#SameName
      vless://uuid-2@s2.com:443?security=tls#SameName
      vless://uuid-3@s3.com:443?security=tls#SameName
    `;
    const res = parseMultipleVless(input);
    expect(res.proxies).toHaveLength(3);
    expect(res.proxies[0].name).toBe('SameName');
    expect(res.proxies[1].name).toBe('SameName 1');
    expect(res.proxies[2].name).toBe('SameName 2');
  });

  it('should generate valid Mihomo YAML in proxies and full mode', () => {
    const input = 'vless://uuid-1@s1.com:443?security=tls#Node1';
    const proxiesRes = vlessToMihomoYaml(input, 'proxies');
    expect(proxiesRes.yaml).toContain('proxies:');
    expect(proxiesRes.yaml).toContain('name: Node1');
    expect(proxiesRes.count).toBe(1);

    const fullRes = vlessToMihomoYaml(input, 'full');
    expect(fullRes.yaml).toContain('proxy-groups:');
    expect(fullRes.yaml).toContain('rules:');
    expect(fullRes.count).toBe(1);
  });
});
