'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Table, Tag, Checkbox, Empty } from 'antd';
import { CopyOutlined, ExperimentOutlined } from '@ant-design/icons';
import { regexTest, regexReplace, regexGetPatternInfo, RegexMatch } from '@/utils/string/regex';
import { useI18n } from '@/contexts/I18nContext';

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

// 高亮颜色（两种交替）
const HIGHLIGHT_COLORS = ['#ffd666', '#85e0a3'];

export default function RegexTesterPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>('test');
  const [pattern, setPattern] = useState('\\w+');
  const [flagValues, setFlagValues] = useState<string[]>(['g']);
  const [testStr, setTestStr] = useState('Hello World 123');
  const [replaceStr, setReplaceStr] = useState('[$&]');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [replaceResult, setReplaceResult] = useState('');
  const [patternError, setPatternError] = useState('');
  const [isValid, setIsValid] = useState(true);

  // 将选中的标志组合成字符串
  const flags = flagValues.join('');

  // 验证正则表达式
  useEffect(() => {
    const info = regexGetPatternInfo(pattern);
    setIsValid(info.isValid);
    setPatternError(info.error || '');
  }, [pattern]);

  // 自动测试或替换
  useEffect(() => {
    if (!isValid || !pattern) {
      setMatches([]);
      setReplaceResult('');
      return;
    }

    if (mode === 'test') {
      const result = regexTest(pattern, flags, testStr);
      setMatches(result.matches);
      setPatternError(result.error || '');
    } else {
      const result = regexReplace(pattern, replaceStr, flags, testStr);
      setReplaceResult(result.result);
      setPatternError(result.error || '');
    }
  }, [pattern, flags, testStr, replaceStr, mode, isValid]);

  const columns = [
    { title: t('tools.regexTester.match'), dataIndex: 'match', key: 'match' },
    { title: t('tools.regexTester.index'), dataIndex: 'index', key: 'index' },
    { title: t('tools.regexTester.groups'), dataIndex: 'groups', key: 'groups', render: (gs: string[] | undefined) => (
      gs?.length ? gs.map((g, i) => <Tag key={i}>{g || t('tools.regexTester.empty')}</Tag>) : '-'
    )},
  ];

  // 生成高亮预览内容
  const renderHighlightPreview = () => {
    if (!testStr) return null;

    const parts: { text: string; colorIndex: number }[] = [];
    let lastIndex = 0;

    // 按位置排序匹配结果
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

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
      <div className="font-mono text-sm p-3 border rounded bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap break-all">
        {parts.map((part, i) => (
          <span
            key={i}
            style={{
              backgroundColor: part.colorIndex >= 0 ? HIGHLIGHT_COLORS[part.colorIndex] : 'transparent',
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
      <Space>
        <Button onClick={() => { setTestStr(''); setReplaceStr('[$&]'); setMatches([]); setReplaceResult(''); }}>
          {t('common.clear')}
        </Button>
      </Space>
      {mode === 'test' && (
        <Card title={t('tools.regexTester.matches', { count: matches.length })} size="small">
          {matches.length > 0 ? (
            <Table dataSource={matches} columns={columns} rowKey={(r) => `${r.index}-${r.match}`} pagination={false} />
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
