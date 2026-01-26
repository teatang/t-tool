'use client';

import React, { createContext, useContext, useState, useLayoutEffect, useCallback } from 'react';

// 翻译数据
const translations: Record<string, Record<string, string>> = {
  zh: {
    // common
    'common.home': '首页',
    'common.tools': '工具',
    'common.clear': '清空',
    'common.copy': '复制',
    'common.copyAll': '复制全部',
    'common.generate': '生成',
    'common.generateOne': '生成一个',
    'common.generateCount': '生成 {count} 个',
    'common.settings': '设置',
    'common.version': '版本',
    'common.batchCount': '批量数量',
    'common.versionInfo': '版本说明',
    'common.input': '输入',
    'common.output': '输出',
    'common.result': '结果',
    'common.action': '操作',
    'common.valid': '有效',
    'common.yes': '是',
    'common.no': '否',

    // home
    'home.title': '开发者工具箱',
    'home.subtitle': '为开发者精选的在线工具集合',

    // nav
    'nav.home': '首页',
    'nav.tools': '工具箱',

    // base64
    'tools.base64.title': 'Base64 编码/解码',
    'tools.base64.encode': '编码',
    'tools.base64.decode': '解码',
    'tools.base64.placeholder': '请输入要编码/解码的文本...',
    'tools.base64.resultPlaceholder': '结果将显示在这里...',
    'tools.base64.errorDecode': '解码失败: 无效的 Base64 输入',

    // urlEncoder
    'tools.urlEncoder.title': 'URL 编码/解码',
    'tools.urlEncoder.encode': '编码',
    'tools.urlEncoder.decode': '解码',
    'tools.urlEncoder.placeholder': '请输入要编码/解码的 URL...',
    'tools.urlEncoder.resultPlaceholder': '结果将显示在这里...',

    // jsonFormatter
    'tools.jsonFormatter.title': 'JSON 格式化',
    'tools.jsonFormatter.format': '格式化',
    'tools.jsonFormatter.minify': '压缩',
    'tools.jsonFormatter.validate': '验证',
    'tools.jsonFormatter.placeholder': '请输入 JSON...',
    'tools.jsonFormatter.validJson': '有效的 JSON',
    'tools.jsonFormatter.invalidJson': '无效的 JSON',

    // htmlFormatter
    'tools.htmlFormatter.title': 'HTML 格式化',
    'tools.htmlFormatter.format': '格式化',
    'tools.htmlFormatter.minify': '压缩',
    'tools.htmlFormatter.placeholder': '请输入 HTML...',

    // sqlFormatter
    'tools.sqlFormatter.title': 'SQL 格式化',
    'tools.sqlFormatter.format': '格式化',
    'tools.sqlFormatter.minify': '压缩',
    'tools.sqlFormatter.placeholder': '请输入 SQL...',

    // regexTester
    'tools.regexTester.title': '正则测试',
    'tools.regexTester.test': '测试',
    'tools.regexTester.replace': '替换',
    'tools.regexTester.pattern': '正则表达式:',
    'tools.regexTester.flags': '标志:',
    'tools.regexTester.testString': '测试字符串',
    'tools.regexTester.replacement': '替换文本',
    'tools.regexTester.testBtn': '测试',
    'tools.regexTester.replaceBtn': '替换',
    'tools.regexTester.matches': '匹配结果 ({count})',
    'tools.regexTester.placeholderPattern': '请输入正则表达式...',
    'tools.regexTester.placeholderFlags': 'g, i, m...',
    'tools.regexTester.placeholderTest': '请输入测试字符串...',
    'tools.regexTester.placeholderReplace': '请输入替换文本...',
    'tools.regexTester.match': '匹配',
    'tools.regexTester.index': '位置',
    'tools.regexTester.groups': '分组',
    'tools.regexTester.empty': '(空)',

    // mermaid
    'tools.mermaid.title': 'Mermaid 图表编辑器',
    'tools.mermaid.template': '模板:',
    'tools.mermaid.editor': '编辑器',
    'tools.mermaid.preview': '预览',
    'tools.mermaid.placeholder': '请输入 Mermaid 图表代码...',
    'tools.mermaid.syntaxError': '语法错误',
    'tools.mermaid.previewPlaceholder': '图表预览将显示在这里',
    'tools.mermaid.previewNote': '使用 Mermaid 在线编辑器查看完整预览',
    'tools.mermaid.enterCode': '请输入 Mermaid 代码查看预览',

    // timestamp
    'tools.timestamp.title': '时间戳转换',
    'tools.timestamp.unixTimestamp': 'Unix 时间戳',
    'tools.timestamp.dateString': '日期字符串',
    'tools.timestamp.now': '现在',
    'tools.timestamp.unix': 'Unix 时间戳',
    'tools.timestamp.milliseconds': '(毫秒)',
    'tools.timestamp.iso8601': 'ISO 8601:',
    'tools.timestamp.utc': 'UTC:',
    'tools.timestamp.local': '本地时间:',
    'tools.timestamp.quickActions': '快捷操作',
    'tools.timestamp.getCurrent': '获取当前时间戳',
    'tools.timestamp.currentSeconds': '当前 (秒)',
    'tools.timestamp.placeholderUnix': '请输入 Unix 时间戳...',
    'tools.timestamp.placeholderDate': '请输入日期字符串 (ISO, UTC 等)...',
    'tools.timestamp.errorInvalidTimestamp': '无效的时间戳',
    'tools.timestamp.errorInvalidDate': '无效的日期格式',

    // uuid
    'tools.uuid.title': 'UUID 生成器',
    'tools.uuid.generate': '生成',
    'tools.uuid.generatedUuids': '已生成 UUID ({count})',
    'tools.uuid.info': '版本说明',
    'tools.uuid.v1': '时间戳版本',
    'tools.uuid.v2': 'DCE 安全版本',
    'tools.uuid.v3': '基于 MD5',
    'tools.uuid.v4': '随机版本',
    'tools.uuid.v5': '基于 SHA-1',

    // theme
    'theme.light': '浅色',
    'theme.dark': '深色',
    'theme.system': '跟随系统',
  },
  en: {
    // common
    'common.home': 'Home',
    'common.tools': 'Tools',
    'common.clear': 'Clear',
    'common.copy': 'Copy',
    'common.copyAll': 'Copy All',
    'common.generate': 'Generate',
    'common.generateOne': 'Generate One',
    'common.generateCount': 'Generate {count}',
    'common.settings': 'Settings',
    'common.version': 'Version',
    'common.batchCount': 'Batch Count',
    'common.versionInfo': 'Version Info',
    'common.input': 'Input',
    'common.output': 'Output',
    'common.result': 'Result',
    'common.action': 'Action',
    'common.valid': 'Valid',
    'common.yes': 'Yes',
    'common.no': 'No',

    // home
    'home.title': 'Developer Tools',
    'home.subtitle': 'A collection of useful tools for developers',

    // nav
    'nav.home': 'Home',
    'nav.tools': 'Toolbox',

    // base64
    'tools.base64.title': 'Base64 Encoder/Decoder',
    'tools.base64.encode': 'Encode',
    'tools.base64.decode': 'Decode',
    'tools.base64.placeholder': 'Enter text to encode/decode...',
    'tools.base64.resultPlaceholder': 'Result will appear here...',
    'tools.base64.errorDecode': 'Decode failed: invalid Base64 input',

    // urlEncoder
    'tools.urlEncoder.title': 'URL Encoder/Decoder',
    'tools.urlEncoder.encode': 'Encode',
    'tools.urlEncoder.decode': 'Decode',
    'tools.urlEncoder.placeholder': 'Enter URL to encode/decode...',
    'tools.urlEncoder.resultPlaceholder': 'Result will appear here...',

    // jsonFormatter
    'tools.jsonFormatter.title': 'JSON Formatter',
    'tools.jsonFormatter.format': 'Format',
    'tools.jsonFormatter.minify': 'Minify',
    'tools.jsonFormatter.validate': 'Validate',
    'tools.jsonFormatter.placeholder': 'Enter JSON...',
    'tools.jsonFormatter.validJson': 'Valid JSON',
    'tools.jsonFormatter.invalidJson': 'Invalid JSON',

    // htmlFormatter
    'tools.htmlFormatter.title': 'HTML Formatter',
    'tools.htmlFormatter.format': 'Format',
    'tools.htmlFormatter.minify': 'Minify',
    'tools.htmlFormatter.placeholder': 'Enter HTML...',

    // sqlFormatter
    'tools.sqlFormatter.title': 'SQL Formatter',
    'tools.sqlFormatter.format': 'Format',
    'tools.sqlFormatter.minify': 'Minify',
    'tools.sqlFormatter.placeholder': 'Enter SQL...',

    // regexTester
    'tools.regexTester.title': 'Regex Tester',
    'tools.regexTester.test': 'Test',
    'tools.regexTester.replace': 'Replace',
    'tools.regexTester.pattern': 'Pattern:',
    'tools.regexTester.flags': 'Flags:',
    'tools.regexTester.testString': 'Test String',
    'tools.regexTester.replacement': 'Replacement',
    'tools.regexTester.testBtn': 'Test',
    'tools.regexTester.replaceBtn': 'Replace',
    'tools.regexTester.matches': 'Matches ({count})',
    'tools.regexTester.placeholderPattern': 'Enter regex pattern...',
    'tools.regexTester.placeholderFlags': 'g, i, m...',
    'tools.regexTester.placeholderTest': 'Enter test string...',
    'tools.regexTester.placeholderReplace': 'Enter replacement string...',
    'tools.regexTester.match': 'Match',
    'tools.regexTester.index': 'Index',
    'tools.regexTester.groups': 'Groups',
    'tools.regexTester.empty': '(empty)',

    // mermaid
    'tools.mermaid.title': 'Mermaid Diagram Editor',
    'tools.mermaid.template': 'Template:',
    'tools.mermaid.editor': 'Editor',
    'tools.mermaid.preview': 'Preview',
    'tools.mermaid.placeholder': 'Enter Mermaid diagram code...',
    'tools.mermaid.syntaxError': 'Syntax Error',
    'tools.mermaid.previewPlaceholder': 'Diagram preview would render here',
    'tools.mermaid.previewNote': 'Use Mermaid Live Editor for preview',
    'tools.mermaid.enterCode': 'Enter Mermaid code to see preview',

    // timestamp
    'tools.timestamp.title': 'Timestamp Converter',
    'tools.timestamp.unixTimestamp': 'Unix Timestamp',
    'tools.timestamp.dateString': 'Date String',
    'tools.timestamp.now': 'Now',
    'tools.timestamp.unix': 'Unix Timestamp',
    'tools.timestamp.milliseconds': '(milliseconds)',
    'tools.timestamp.iso8601': 'ISO 8601:',
    'tools.timestamp.utc': 'UTC:',
    'tools.timestamp.local': 'Local:',
    'tools.timestamp.quickActions': 'Quick Actions',
    'tools.timestamp.getCurrent': 'Get Current Timestamp',
    'tools.timestamp.currentSeconds': 'Current (seconds)',
    'tools.timestamp.placeholderUnix': 'Enter Unix timestamp...',
    'tools.timestamp.placeholderDate': 'Enter date string (ISO, UTC, etc.)...',
    'tools.timestamp.errorInvalidTimestamp': 'Invalid timestamp',
    'tools.timestamp.errorInvalidDate': 'Invalid date',

    // uuid
    'tools.uuid.title': 'UUID Generator',
    'tools.uuid.generate': 'Generate',
    'tools.uuid.generatedUuids': 'Generated UUIDs ({count})',
    'tools.uuid.info': 'Info',
    'tools.uuid.v1': 'Time-based',
    'tools.uuid.v2': 'DCE Security',
    'tools.uuid.v3': 'MD5-based',
    'tools.uuid.v4': 'Random',
    'tools.uuid.v5': 'SHA-1-based',

    // theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
  },
};

type Locale = 'zh' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// SSR 期间的默认翻译函数（使用中文）
const defaultT = (key: string, params?: Record<string, string | number>): string => {
  let text = translations.zh[key] || key;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }

  return text;
};

// 默认上下文值（用于 SSR）
const defaultContext: I18nContextType = {
  locale: 'zh',
  setLocale: () => {},
  t: defaultT,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh');

  // 从 localStorage 读取保存的语言设置（使用 useLayoutEffect 避免闪烁）
  useLayoutEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const lang = translations[locale];
    let text = lang[key] || translations.zh[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  // SSR 期间返回默认值，避免渲染错误
  if (!context) {
    return defaultContext;
  }
  return context;
}

// 导出语言标签供 UI 使用
export const localeLabels = {
  zh: '中文',
  en: 'EN',
} as const;
