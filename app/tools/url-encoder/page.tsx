'use client';

import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Segmented } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { urlEncode, urlDecode } from '@/utils/string/url';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'encode' | 'decode';

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    const result = mode === 'encode' ? urlEncode(input) : urlDecode(input);
    setOutput(result);
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <Title level={3}>URL 编码/解码</Title>
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
            placeholder="请输入要编码/解码的 URL..."
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
        <Button onClick={() => { setInput(''); setOutput(''); }}>
          清空
        </Button>
      </Space>
    </div>
  );
}
