'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Alert } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { sqlFormat, sqlMinify } from '@/utils/sql/formatter';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'format' | 'minify';

export default function SqlFormatterPage() {
  const [mode, setMode] = useState<Mode>('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (input.trim()) {
      try {
        if (mode === 'format') {
          setOutput(sqlFormat(input));
        } else {
          setOutput(sqlMinify(input));
        }
        setError('');
      } catch (e) {
        setError((e as Error).message);
      }
    } else {
      setOutput('');
      setError('');
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <Title level={3}>SQL 格式化</Title>
      <Segmented
        options={[
          { label: '格式化', value: 'format' },
          { label: '压缩', value: 'minify' },
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
            placeholder="请输入 SQL..."
          />
        </Card>
        <Card title="输出" size="small" extra={
          output && <Button icon={<CopyOutlined />} onClick={handleCopy} />
        }>
          <TextArea value={output} rows={10} readOnly />
        </Card>
      </div>
      <Space>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          清空
        </Button>
      </Space>
      {error && <Alert type="error" message={error} showIcon />}
    </div>
  );
}
