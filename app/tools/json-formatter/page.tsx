'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Alert, Tag } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { jsonFormat, jsonMinify, jsonValidate } from '@/utils/string/json';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'format' | 'minify' | 'validate';

export default function JsonFormatterPage() {
  const [mode, setMode] = useState<Mode>('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'valid' | 'invalid' | ''>('');

  
  useEffect(() => {
    if (input.trim()) {
      if (mode === 'validate') {
        const result = jsonValidate(input);
        setStatus(result.valid ? 'valid' : 'invalid');
        setOutput('');
        setError(result.error || '');
      } else if (mode === 'format') {
        const result = jsonFormat(input);
        setOutput(result.result);
        setError(result.error || '');
      } else {
        const result = jsonMinify(input);
        setOutput(result.result);
        setError(result.error || '');
      }
    } else {
      setOutput('');
      setError('');
      setStatus('');
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <Title level={3}>JSON 格式化</Title>
      <Segmented
        options={[
          { label: '格式化', value: 'format' },
          { label: '压缩', value: 'minify' },
          { label: '验证', value: 'validate' },
        ]}
        value={mode}
        onChange={(val) => setMode(val as Mode)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="输入" size="small">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder="请输入 JSON..."
          />
        </Card>
        <Card title="输出" size="small" extra={
          mode !== 'validate' && output && (
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
          )
        }>
          {mode === 'validate' ? (
            <div className="py-4">
              {status === 'valid' && <Tag color="success">有效的 JSON</Tag>}
              {status === 'invalid' && <Tag color="error">无效的 JSON</Tag>}
            </div>
          ) : (
            <TextArea value={output} rows={10} readOnly />
          )}
        </Card>
      </div>
      <Space>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); setStatus(''); }}>
          清空
        </Button>
      </Space>
      {error && <Alert type="error" message={error} showIcon />}
    </div>
  );
}
