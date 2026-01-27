'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Table, Tag, Checkbox, Empty } from 'antd';
import { CopyOutlined, ExperimentOutlined } from '@ant-design/icons';
import { regexGetPatternInfo, RegexMatch } from '@/utils/string/regex';
import { useI18n } from '@/contexts/I18nContext';
import { useAppSelector } from '@/lib/store/hooks';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;
const { TextArea } = Input;

type Mode = 'test' | 'replace';

// 可用的正则标志
const FLAG_OPTIONS = [
  { label: 'g', value: 'g', title: '全局匹配' },
  { label: 'i', value: 'i', title: '忽略大小写' },
  { label: 'm', value: 'm', title: '多行模式' },
  { label: 's', value: 's', title: 'dotAll 模式' },
  { label: 'u', value: 'u', title: 'Unicode' },
  { label: 'y', value: 'y', title: '粘性匹配' },
];

// 高亮颜色（两种交替）- 适配浅色/深色模式
const HIGHLIGHT_COLORS = {
  light: ['#fff566', '#95de64'],  // 浅色模式：柔和黄、柔和绿
  dark: ['#d4b106', '#73d13d'],   // 深色模式
};

// 超时时间（毫秒）
const REGEX_TIMEOUT_MS = 300;

export default function RegexTesterPage() {
  const { t } = useI18n();
  const isDark = useAppSelector((state) => state.theme?.isDark ?? false);
  const [mode, setMode] = useState<Mode>('test');
  const [pattern, setPattern] = useState('\\w+');
  const [flagValues, setFlagValues] = useState<string[]>(['g']);
  const [testStr, setTestStr] = useState('Hello World 123');
  const [replaceStr, setReplaceStr] = useState('[$&]');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [replaceResult, setReplaceResult] = useState('');
  const [patternError, setPatternError] = useState('');
  const [isValid, setIsValid] = useState(true);

  // 使用 ref 跟踪任务状态
  const taskRef = useRef<{ cancelled: boolean; startTime: number }>({ cancelled: false, startTime: 0 });

  // 根据主题获取高亮颜色
  const highlightColors = isDark ? HIGHLIGHT_COLORS.dark : HIGHLIGHT_COLORS.light;

  // 将选中的标志组合成字符串
  const flags = flagValues.join('');

  // 验证正则表达式
  useEffect(() => {
    const info = regexGetPatternInfo(pattern);
    setIsValid(info.isValid);
    setPatternError(info.error || '');
  }, [pattern]);

  // 带超时的正则测试
  const regexTestWithTimeout = useCallback((pat: string, fl: string, txt: string): { matches: RegexMatch[]; error?: string } => {
    // 设置任务开始时间
    taskRef.current.startTime = Date.now();

    // 创建一个超时检查器
    const checkTimeout = () => {
      if (Date.now() - taskRef.current.startTime > REGEX_TIMEOUT_MS) {
        return true;
      }
      return false;
    };

    try {
      const regex = new RegExp(pat, fl);
      const matches: RegexMatch[] = [];
      let match;
      let iterations = 0;
      const MAX_ITERATIONS = 100000;

      while ((match = regex.exec(txt)) !== null) {
        // 检查超时
        if (checkTimeout()) {
          return { matches, error: 'Execution timed out' };
        }

        iterations++;
        if (iterations > MAX_ITERATIONS) {
          return { matches, error: 'Too many matches' };
        }
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1).map((g) => g || ''),
        });

        // 防止零长度无限匹配
        if (match.index === regex.lastIndex && match[0].length === 0) {
          regex.lastIndex++;
          if (regex.lastIndex > txt.length) break;
        }
      }

      return { matches };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, []);

  // 带超时的正则替换
  const regexReplaceWithTimeout = useCallback((pat: string, repl: string, fl: string, txt: string): { result: string; error?: string } => {
    taskRef.current.startTime = Date.now();

    try {
      const regex = new RegExp(pat, fl);
      return { result: txt.replace(regex, repl) };
    } catch (e) {
      return { result: txt, error: (e as Error).message };
    }
  }, []);

  // 自动测试或替换
  useEffect(() => {
    // 取消之前的任务
    taskRef.current.cancelled = true;

    if (!isValid || !pattern) {
      setMatches([]);
      setReplaceResult('');
      return;
    }

    // 使用 setTimeout 避免阻塞 UI
    const timer = setTimeout(() => {
      taskRef.current.cancelled = false;
      taskRef.current.startTime = Date.now();

      if (mode === 'test') {
        const result = regexTestWithTimeout(pattern, flags, testStr);
        if (!taskRef.current.cancelled) {
          setMatches(result.matches);
          setPatternError(result.error || '');
        }
      } else {
        const result = regexReplaceWithTimeout(pattern, replaceStr, flags, testStr);
        if (!taskRef.current.cancelled) {
          setReplaceResult(result.result);
          setPatternError(result.error || '');
        }
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [pattern, flags, testStr, replaceStr, mode, isValid, regexTestWithTimeout, regexReplaceWithTimeout]);

  const columns = [
    { title: t('tools.regexTester.match'), dataIndex: 'match', key: 'match' },
    { title: t('tools.regexTester.index'), dataIndex: 'index', key: 'index' },
    { title: t('tools.regexTester.groups'), dataIndex: 'groups', key: 'groups', render: (gs: string[] | undefined) => (
      gs?.length ? gs.map((g, i) => <Tag key={i}>{g || t('tools.regexTester.empty')}</Tag>) : '-'
    )},
  ];

  // 为匹配结果添加唯一ID（因为空匹配可能有相同index）
  const matchesWithId = matches.map((m, i) => ({ ...m, _uid: `${m.index}-${i}` }));

  // 生成高亮预览内容
  const renderHighlightPreview = () => {
    if (!testStr) return null;

    const parts: { text: string; colorIndex: number }[] = [];
    let lastIndex = 0;

    // 按位置排序匹配结果
    const sortedMatches = [...matchesWithId].sort((a, b) => a.index - b.index);

    for (let i = 0; i < sortedMatches.length; i++) {
      const match = sortedMatches[i];
      if (match.index > lastIndex) {
        parts.push({ text: testStr.slice(lastIndex, match.index), colorIndex: -1 });
      }
      parts.push({ text: match.match, colorIndex: i % 2 });
      lastIndex = match.index + match.match.length;
    }

    if (lastIndex < testStr.length) {
      parts.push({ text: testStr.slice(lastIndex), colorIndex: -1 });
    }

    return (
      <div
        className="font-mono text-sm p-3 border rounded whitespace-pre-wrap break-all"
        style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}
      >
        {parts.map((part, i) => (
          <span
            key={i}
            style={{
              backgroundColor: part.colorIndex >= 0 ? highlightColors[part.colorIndex] : 'transparent',
              color: part.colorIndex >= 0 ? '#000' : 'inherit',
              padding: part.colorIndex >= 0 ? '1px 2px' : 0,
              borderRadius: part.colorIndex >= 0 ? '2px' : 0,
            }}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Title level={3}><ExperimentOutlined /> {t('tools.regexTester.title')}</Title>
      <Segmented
        options={[
          { label: t('tools.regexTester.test'), value: 'test' },
          { label: t('tools.regexTester.replace'), value: 'replace' },
        ]}
        value={mode}
        onChange={(val) => setMode(val as Mode)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Text strong>{t('tools.regexTester.pattern')}</Text>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t('tools.regexTester.placeholderPattern')}
            status={isValid ? '' : 'error'}
          />
          {!isValid && <Text type="danger">{patternError}</Text>}
        </div>
        <div>
          <Text strong>{t('tools.regexTester.flags')}</Text>
          <div className="mt-1">
            <Checkbox.Group
              value={flagValues}
              onChange={(values) => setFlagValues(values as string[])}
            >
              {FLAG_OPTIONS.map((flag) => (
                <Checkbox key={flag.value} value={flag.value} title={flag.title}>
                  {flag.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        </div>
      </div>
      <Card title={t('tools.regexTester.testString')} size="small">
        <TextArea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          rows={4}
        />
        {mode === 'test' && matches.length > 0 && (
          <div className="mt-3">
            <Text type="secondary" className="mb-2 block">{t('tools.regexTester.matches', { count: matches.length })}</Text>
            {renderHighlightPreview()}
          </div>
        )}
      </Card>
      {mode === 'replace' && (
        <Card title={t('tools.regexTester.replacement')} size="small">
          <Input
            value={replaceStr}
            onChange={(e) => setReplaceStr(e.target.value)}
            placeholder={t('tools.regexTester.placeholderReplace')}
          />
        </Card>
      )}
      <Space className="mt-4">
        <Button onClick={() => { setTestStr(''); setReplaceStr('[$&]'); setMatches([]); setReplaceResult(''); }}>
          {t('common.clear')}
        </Button>
      </Space>
      {mode === 'test' && (
        <Card title={t('tools.regexTester.matches', { count: matches.length })} size="small">
          {matches.length > 0 ? (
            <Table dataSource={matchesWithId} columns={columns} rowKey="_uid" pagination={false} />
          ) : (
            <Empty description={t('tools.regexTester.testString')} />
          )}
        </Card>
      )}
      {mode === 'replace' && (
        <Card title={t('common.result')} size="small" extra={
          replaceResult && <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(replaceResult)} />
        }>
          <pre className="whitespace-pre-wrap">{replaceResult}</pre>
        </Card>
      )}
    </div>
  );
}
