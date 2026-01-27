# 工具箱 - 开发者工具集合

基于 Next.js 16、Redux Toolkit、Ant Design 和 Tailwind CSS 构建的开发者工具集合网站。

## 功能特性

### 字符串处理工具
- **Base64** - Base64 编码/解码
- **URL 编码** - URL 编码/解码
- **JSON 格式化** - JSON 格式化、压缩、语法验证
- **HTML 格式化** - HTML 格式化/压缩
- **SQL 格式化** - SQL 语句格式化/压缩
- **正则测试** - 正则表达式测试、匹配高亮、替换

### 其他工具
- **Mermaid** - Mermaid 图表编辑器，支持多种图表类型
- **时间戳** - Unix 时间戳与日期字符串相互转换
- **UUID** - UUID v1/v4/v5 生成器

### 休闲游戏
- **俄罗斯方块** - 经典俄罗斯方块游戏，支持深色/浅色模式

### 功能特性
- **深色模式** - 浅色/深色/系统自动三种模式
- **中英文切换** - 支持中文和英文界面
- **主题持久化** - 主题偏好和语言设置自动保存
- **响应式设计** - 完美适配桌面端和移动端

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 | React 框架 (App Router) |
| Redux Toolkit | 全局状态管理 |
| Ant Design v5 | UI 组件库 |
| Tailwind CSS v4 | 样式框架 |
| Vitest | 单元测试 |
| TypeScript | 类型安全 |

## 快速开始

### 环境要求
- Node.js 18+
- pnpm 9+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看工具。

## 可用命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 (热重载) |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | 运行代码检查 |
| `pnpm test` | 运行单元测试 |
| `pnpm test:coverage` | 运行测试并生成覆盖率报告 |

## 项目结构

```
t-tool/
├── app/                           # Next.js 应用目录
│   ├── layout.tsx                 # 根布局
│   ├── page.tsx                   # 首页
│   ├── globals.css                # 全局样式 (Tailwind CSS v4)
│   ├── providers.tsx              # Redux + Ant Design Provider
│   └── tools/                     # 工具页面
│       ├── base64/                # Base64 工具
│       ├── url-encoder/           # URL 编码工具
│       ├── json-formatter/        # JSON 格式化工具
│       ├── html-formatter/        # HTML 格式化工具
│       ├── sql-formatter/         # SQL 格式化工具
│       ├── regex-tester/          # 正则测试工具
│       ├── mermaid/               # Mermaid 编辑器
│       ├── timestamp/             # 时间戳转换器
│       ├── uuid/                  # UUID 生成器
│       └── games/                 # 休闲游戏
│           └── tetris/            # 俄罗斯方块
├── components/                    # React 组件
│   └── ui/                        # UI 组件
│       ├── Layout.tsx             # 应用布局组件
│       ├── ThemeToggle.tsx        # 主题切换按钮
│       ├── LanguageSwitcher.tsx   # 语言切换按钮
│       └── ToolCard.tsx           # 工具卡片组件
├── contexts/                      # React Context
│   └── I18nContext.tsx            # 国际化上下文
├── lib/                           # 库文件
│   └── store/                     # Redux Store
│       ├── index.ts               # Store 配置
│       ├── hooks.ts               # Typed Redux hooks
│       └── slices/
│           └── themeSlice.ts      # 主题状态管理
├── utils/                         # 工具函数
│   ├── string/                    # 字符串处理
│   │   ├── base64.ts
│   │   ├── url.ts
│   │   ├── json.ts
│   │   ├── html.ts
│   │   └── regex.ts
│   ├── sql/
│   │   └── formatter.ts
│   └── other/                     # 其他工具
│       ├── mermaid.ts
│       ├── timestamp.ts
│       └── uuid.ts
├── tests/                         # 测试文件
│   ├── string/
│   ├── other/
│   └── games/                      # 游戏测试
│       └── tetris.test.ts          # 俄罗斯方块测试
├── CLAUDE.md                      # Claude Code 指导文件
└── README.md                      # 中文说明文档
└── README_EN.md                   # English documentation
```

## 测试覆盖

项目使用 Vitest 进行单元测试，当前测试覆盖：

- Base64 编码/解码 (6 tests)
- URL 编码/解码 (7 tests)
- JSON 格式化/验证 (7 tests)
- HTML 格式化/压缩 (5 tests)
- SQL 格式化/压缩 (19 tests)
- 正则表达式 (8 tests)
- 时间戳转换 (6 tests)
- UUID 生成 (10 tests)
- Mermaid 工具 (10 tests)

## 许可证

MIT License
