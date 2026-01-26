# 工具箱 - 开发者工具集合

基于 Next.js 16、Redux Toolkit、Ant Design 和 Tailwind CSS 构建的开发者工具集合网站。

## 功能特性

- **字符串处理工具**
  - Base64 编码/解码
  - URL 编码/解码
  - JSON 格式化/验证
  - HTML 格式化/压缩
  - SQL 格式化
  - 正则表达式测试器

- **其他工具**
  - Mermaid 图表编辑器
  - 时间戳转换器
  - UUID 生成器

- **深色模式支持**
  - 浅色/深色/系统自动三种模式
  - 主题偏好持久化存储

## 技术栈

- **框架**: Next.js 16 (App Router)
- **状态管理**: Redux Toolkit
- **UI 组件库**: Ant Design v5
- **样式**: Tailwind CSS v4
- **测试**: Vitest

## 快速开始

首先安装依赖：

```bash
pnpm install
```

然后启动开发服务器：

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看工具。

## 可用命令

```bash
# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 项目结构

```
t-tool/
├── app/                        # Next.js 应用目录
│   ├── layout.tsx             # 根布局，包含 Redux 和 Ant Design Provider
│   ├── page.tsx               # 首页
│   ├── globals.css            # 全局样式
│   ├── providers.tsx          # Redux + Ant Design Provider 组件
│   └── tools/                 # 工具页面
│       ├── base64/            # Base64 工具
│       ├── url-encoder/       # URL 编码工具
│       ├── json-formatter/    # JSON 格式化工具
│       ├── html-formatter/    # HTML 格式化工具
│       ├── sql-formatter/     # SQL 格式化工具
│       ├── regex-tester/      # 正则测试工具
│       ├── mermaid/           # Mermaid 编辑器
│       ├── timestamp/         # 时间戳转换器
│       └── uuid/              # UUID 生成器
├── lib/                       # 库文件
│   └── store/                 # Redux 状态管理
│       ├── index.ts           # Store 配置
│       ├── hooks.ts           # Typed Redux hooks
│       └── slices/            # Redux slices
│           └── themeSlice.ts  # 主题状态管理
├── components/                # React 组件
│   └── ui/                    # UI 组件
│       ├── Layout.tsx         # 应用布局组件
│       └── ThemeToggle.tsx    # 主题切换按钮
├── hooks/                     # 自定义 Hooks
│   ├── useTheme.ts            # 主题管理 Hook
│   ├── useThemeInit.ts        # 主题初始化 Hook
│   └── useLocalStorage.ts     # Local Storage Hook
├── utils/                     # 工具函数
│   ├── string/                # 字符串处理工具
│   │   ├── base64.ts
│   │   ├── url.ts
│   │   ├── json.ts
│   │   ├── html.ts
│   │   └── regex.ts
│   ├── sql/
│   │   └── formatter.ts
│   └── other/                 # 其他工具
│       ├── mermaid.ts
│       ├── timestamp.ts
│       └── uuid.ts
└── tests/                     # 测试文件
    ├── string/
    └── other/
```

## 许可证

MIT
