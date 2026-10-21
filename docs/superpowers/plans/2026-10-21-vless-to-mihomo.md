# VLESS to Mihomo YAML Converter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new tool under String Tools that converts VLESS share links into Mihomo (Clash Meta) compatible YAML configuration format.

**Architecture:** A pure TypeScript parsing module parses single or multi-line VLESS URLs (supporting TCP, WS, gRPC, H2, TLS, Reality, Vision flow, etc.) into structured Mihomo proxy definitions and serializes to YAML using `yaml`. An Ant Design + Tailwind React client page provides user inputs, output mode toggle (proxies-only vs. full config), copy, download, and status alerts, integrated with I18n and global navigation.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Ant Design v5, `yaml` package, Vitest.

**Spec:** Direct user requirement: "在字符串工具下面添加一个新的工具用于把vless链接转换成mihomo的yaml格式" (Add a new tool under string tools to convert VLESS links to Mihomo YAML format).

## Global Constraints

- Must be placed under the "字符串工具" (String Tools) category in navigation and homepage.
- Route must be `/tools/vless-to-mihomo`.
- Must support dark/light mode consistent with existing Ant Design theme and Tailwind setup.
- Must support both Chinese (`zh`) and English (`en`) via `I18nContext`.
- Must support common VLESS parameters: `uuid`, `server`, `port`, `type` (`ws`, `grpc`, `tcp`, `h2`), `security` (`tls`, `reality`, `none`), `sni`/`serverName`, `fp`, `flow`, `pbk`, `sid`, `path`, `host`, `alpn`, `insecure`.
- Must support multi-line batch conversion and error reporting.

## Review Focus

- Malformed VLESS link missing port or host or UUID: parser should record error gracefully without throwing uncaught exceptions.
- URL-encoded characters in node names (e.g. `#%F0%9F%87%BA%F0%9F%87%B8%20Node`) or query params (e.g. `path=%2Fws`): parser must properly `decodeURIComponent`.
- Reality options: when `security=reality`, correctly map `pbk` -> `reality-opts.public-key`, `sid` -> `reality-opts.short-id`, `fp` -> `client-fingerprint`.
- WebSocket options: correctly map `path` and `host` header into `ws-opts`.
- gRPC options: correctly map `serviceName` into `grpc-opts.grpc-service-name`.

---

### Task 1: Core VLESS Parser and YAML Serializer

**Files:**
- Create: `utils/string/vless.ts`
- Modify: `utils/index.ts`
- Test: `tests/string/vless.test.ts`

**Interfaces:**
- Produces:
  ```ts
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

  export function parseVlessUrl(url: string): VlessProxyConfig;
  export function parseMultipleVless(text: string): ParseVlessResult;
  export function vlessToMihomoYaml(input: string, mode?: 'proxies' | 'full'): { yaml: string; count: number; errors: string[] };
  ```

- [ ] **Step 1: Write the failing tests in `tests/string/vless.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { parseVlessUrl, parseMultipleVless, vlessToMihomoYaml } from '@/utils/string/vless';

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

  it('should parse multiple links and handle invalid lines', () => {
    const input = `
      vless://uuid-1@s1.com:443?security=tls#Node1
      invalid-link
      vless://uuid-2@s2.com:80?type=ws#Node2
    `;
    const res = parseMultipleVless(input);
    expect(res.proxies).toHaveLength(2);
    expect(res.errors).toHaveLength(1);
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
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test run tests/string/vless.test.ts`
Expected: FAIL with module `@/utils/string/vless` not found.

- [ ] **Step 3: Implement `utils/string/vless.ts` and export in `utils/index.ts`**

Implement URL parsing, query param extraction, transport opts formatting, and YAML stringification using `yaml`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test run tests/string/vless.test.ts`
Expected: PASS (all tests pass)

- [ ] **Step 5: Commit**

```bash
git add utils/string/vless.ts utils/index.ts tests/string/vless.test.ts package.json pnpm-lock.yaml
git commit -m "feat(vless): add VLESS link parser and Mihomo YAML generator"
```

---

### Task 2: Internationalization (i18n)

**Files:**
- Modify: `contexts/I18nContext.tsx`

**Interfaces:**
- Consumes: `I18nContext`
- Produces: `tools.vlessToMihomo.*` keys in `zh` and `en` dictionaries.

- [ ] **Step 1: Add translation keys for `tools.vlessToMihomo` in `contexts/I18nContext.tsx`**

Add bilingual definitions for:
- `tools.vlessToMihomo.title`: 'VLESS 转 Mihomo (Clash Meta)' / 'VLESS to Mihomo'
- `tools.vlessToMihomo.name`: 'VLESS 转 Mihomo' / 'VLESS to Mihomo'
- `tools.vlessToMihomo.description`: '将 VLESS 节点链接批量转换为 Mihomo / Clash Meta 代理配置' / 'Batch convert VLESS links to Mihomo / Clash Meta YAML'
- `tools.vlessToMihomo.outputMode`: '输出模式' / 'Output Mode'
- `tools.vlessToMihomo.proxiesOnly`: '仅节点 (proxies)' / 'Proxies Only'
- `tools.vlessToMihomo.fullConfig`: '完整配置 (Full Config)' / 'Full Config'
- `tools.vlessToMihomo.placeholder`: '请输入 VLESS 链接，支持多行批量输入 (每行一条)...' / 'Enter VLESS link(s), one per line...'
- `tools.vlessToMihomo.resultPlaceholder`: '转换后的 YAML 将在此处显示...' / 'Converted YAML will appear here...'
- `tools.vlessToMihomo.convert`: '转换' / 'Convert'
- `tools.vlessToMihomo.download`: '下载 YAML' / 'Download YAML'
- `tools.vlessToMihomo.copySuccess`: '已复制到剪贴板' / 'Copied to clipboard'
- `tools.vlessToMihomo.sample`: '填入示例' / 'Load Sample'
- `tools.vlessToMihomo.convertedCount`: '已成功转换 {count} 个节点' / 'Successfully converted {count} nodes'
- `tools.vlessToMihomo.errorInvalid`: '未找到有效的 VLESS 链接' / 'No valid VLESS links found'

- [ ] **Step 2: Verify existing tests and types pass**

Run: `pnpm test run`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add contexts/I18nContext.tsx
git commit -m "feat(i18n): add translations for vless-to-mihomo tool"
```

---

### Task 3: Build the VLESS to Mihomo Tool Page

**Files:**
- Create: `app/tools/vless-to-mihomo/page.tsx`

**Interfaces:**
- Consumes: `vlessToMihomoYaml`, `parseMultipleVless` from `@/utils`, `useI18n` from `@/contexts/I18nContext`.
- Produces: Next.js page component at `/tools/vless-to-mihomo`.

- [ ] **Step 1: Create `app/tools/vless-to-mihomo/page.tsx`**

Page includes:
- Page title with Thunderbolt/Api icon and internationalized title.
- Control bar: Mode switcher (proxies-only vs. full config) using `Segmented`, "Load Sample" button.
- Two-column grid (responsive: 1 col on mobile, 2 cols on md+):
  - Left card: Input textarea with line count and clear button.
  - Right card: Output textarea (read-only, monospace) with Copy button and Download button (`mihomo.yaml`).
- Action row: Convert button, Clear button, status message / node count badge.
- Alert display for any skipped lines or errors.
- Sample VLESS links for one-click testing (Reality and WS examples).

- [ ] **Step 2: Verify page build with `pnpm lint` and Next build check**

Run: `pnpm lint`
Expected: PASS with no lint errors.

- [ ] **Step 3: Commit**

```bash
git add app/tools/vless-to-mihomo/page.tsx
git commit -m "feat(page): create vless-to-mihomo tool page"
```

---

### Task 4: Register Tool in Navigation and Homepage

**Files:**
- Modify: `components/ui/Layout.tsx`
- Modify: `app/page.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: `/tools/vless-to-mihomo`
- Produces: Updated String Tools sidebar menu and Homepage tool card grid.

- [ ] **Step 1: Add tool to `getStringToolItems` in `components/ui/Layout.tsx`**

Add:
```tsx
{ key: '/tools/vless-to-mihomo', icon: <ThunderboltOutlined />, label: <Link href="/tools/vless-to-mihomo">{t('tools.vlessToMihomo.name')}</Link> }
```

- [ ] **Step 2: Add tool card to `HomePage` in `app/page.tsx`**

Add:
```tsx
{ href: '/tools/vless-to-mihomo', title: t('tools.vlessToMihomo.name'), description: t('tools.vlessToMihomo.description'), icon: <ThunderboltOutlined /> }
```

- [ ] **Step 3: Update `README.md` list of string tools**

Add VLESS to Mihomo converter to the string tools section of `README.md`.

- [ ] **Step 4: Run full test suite and build**

Run: `pnpm test run && pnpm build`
Expected: All tests pass and build succeeds cleanly.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Layout.tsx app/page.tsx README.md
git commit -m "feat(nav): register vless-to-mihomo in sidebar menu and homepage"
```
