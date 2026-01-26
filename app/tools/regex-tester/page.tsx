'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Table, Tag } from 'antd';
import { CopyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { regexTest, regexReplace, regexGetPatternInfo, RegexMatch } from '@/utils/string/regex';

const { Title, Text } = Typography;
const { TextArea } = Input;

type Mode = 'test' | 'replace';

export default function RegexTesterPage() {
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
    { title: '匹配', dataIndex: 'match', key: 'match' },
    { title: '位置', dataIndex: 'index', key: 'index' },
    { title: '分组', dataIndex: 'groups', key: 'groups', render: (gs: string[] | undefined) => (
      gs?.length ? gs.map((g, i) => <Tag key={i}>{g || '(空)'}</Tag>) : '-'
    )},
  ];

  return (
    <div className="space-y-4">
      <Title level={3}>正则测试</Title>
      <Segmented
        options={[
          { label: '测试', value: 'test' },
          { label: '替换', value: 'replace' },
        ]}
        value={mode}
        onChange={(val) => setMode(val as Mode)}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text strong>正则表达式:</Text>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="请输入正则表达式..."
            status={isValid ? '' : 'error'}
          />
          {!isValid && <Text type="danger">{patternError}</Text>}
        </div>
        <div>
          <Text strong>标志:</Text>
          <Input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m..."
          />
        </div>
      </div>
      <Card title="测试字符串" size="small">
        <TextArea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          rows={4}
        />
      </Card>
      {mode === 'replace' && (
        <Card title="替换文本" size="small">
          <Input
            value={replaceStr}
            onChange={(e) => setReplaceStr(e.target.value)}
            placeholder="请输入替换文本..."
          />
        </Card>
      )}
      <Space>
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={mode === 'test' ? handleTest : handleReplace}>
          {mode === 'test' ? '测试' : '替换'}
        </Button>
        <Button onClick={() => { setTestStr(''); setMatches([]); setReplaceResult(''); }}>
          清空
        </Button>
      </Space>
      {mode === 'test' && matches.length > 0 && (
        <Card title={`匹配结果 (${matches.length})`} size="small">
          <Table dataSource={matches} columns={columns} rowKey={(r) => `${r.index}-${r.match}`} pagination={false} />
        </Card>
      )}
      {mode === 'replace' && replaceResult && (
        <Card title="结果" size="small" extra={<Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(replaceResult)} />}>
          <pre className="whitespace-pre-wrap">{replaceResult}</pre>
        </Card>
      )}
    </div>
  );
}
