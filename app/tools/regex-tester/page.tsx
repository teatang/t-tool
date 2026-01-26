'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Table, Tag } from 'antd';
import { CopyOutlined, PlayCircleOutlined, ExperimentOutlined } from '@ant-design/icons';
import { regexTest, regexReplace, regexGetPatternInfo, RegexMatch } from '@/utils/string/regex';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;
const { TextArea } = Input;

type Mode = 'test' | 'replace';

export default function RegexTesterPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>('test');
  const [pattern, setPattern] = useState('\\w+');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('Hello World 123');
  const [replaceStr, setReplaceStr] = useState('[$&]');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [replaceResult, setReplaceResult] = useState('');
  const [patternError, setPatternError] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const info = regexGetPatternInfo(pattern);
    setIsValid(info.isValid);
    setPatternError(info.error || '');
  }, [pattern]);

  const handleTest = () => {
    if (!isValid) return;
    const result = regexTest(pattern, flags, testStr);
    setMatches(result.matches);
    setPatternError(result.error || '');
  };

  const handleReplace = () => {
    if (!isValid) return;
    const result = regexReplace(pattern, replaceStr, flags, testStr);
    setReplaceResult(result.result);
    setPatternError(result.error || '');
  };

  const columns = [
    { title: t('tools.regexTester.match'), dataIndex: 'match', key: 'match' },
    { title: t('tools.regexTester.index'), dataIndex: 'index', key: 'index' },
    { title: t('tools.regexTester.groups'), dataIndex: 'groups', key: 'groups', render: (gs: string[] | undefined) => (
      gs?.length ? gs.map((g, i) => <Tag key={i}>{g || t('tools.regexTester.empty')}</Tag>) : '-'
    )},
  ];

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
      <div className="grid grid-cols-2 gap-4">
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
          <Input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder={t('tools.regexTester.placeholderFlags')}
          />
        </div>
      </div>
      <Card title={t('tools.regexTester.testString')} size="small">
        <TextArea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          rows={4}
        />
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
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={mode === 'test' ? handleTest : handleReplace}>
          {mode === 'test' ? t('tools.regexTester.testBtn') : t('tools.regexTester.replaceBtn')}
        </Button>
        <Button onClick={() => { setTestStr(''); setMatches([]); setReplaceResult(''); }}>
          {t('common.clear')}
        </Button>
      </Space>
      {mode === 'test' && matches.length > 0 && (
        <Card title={t('tools.regexTester.matches', { count: matches.length })} size="small">
          <Table dataSource={matches} columns={columns} rowKey={(r) => `${r.index}-${r.match}`} pagination={false} />
        </Card>
      )}
      {mode === 'replace' && replaceResult && (
        <Card title={t('common.result')} size="small" extra={<Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(replaceResult)} />}>
          <pre className="whitespace-pre-wrap">{replaceResult}</pre>
        </Card>
      )}
    </div>
  );
}
