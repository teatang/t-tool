'use client';

import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Alert } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { base64Encode, base64Decode } from '@/utils/string/base64';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'encode' | 'decode';

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleTransform = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      const result = mode === 'encode' ? base64Encode(input) : base64Decode(input);
      setOutput(result);
      if (result === '无效的 Base64 输入') {
        setError('解码失败: 无效的 Base64 输入');
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <Title level={3}>Base64 编码/解码</Title>
      <Segmented
        options={[
          { label: '编码', value: 'encode' },
          { label: '解码', value: 'decode' },
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
            placeholder="请输入要编码/解码的文本..."
          />
        </Card>
        <Card title="输出" size="small" extra={
          <Space>
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
            <Button icon={<ReloadOutlined />} onClick={handleSwap} />
          </Space>
        }>
          <TextArea value={output} rows={10} readOnly placeholder="结果将显示在这里..." />
        </Card>
      </div>
      <Space>
        <Button type="primary" onClick={handleTransform}>
          {mode === 'encode' ? '编码' : '解码'}
        </Button>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          清空
        </Button>
      </Space>
      {error && <Alert type="error" message={error} showIcon />}
    </div>
  );
}
