'use client';

import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Alert } from 'antd';
import { CopyOutlined, ReloadOutlined, LockOutlined } from '@ant-design/icons';
import { base64Encode, base64Decode } from '@/utils/string/base64';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'encode' | 'decode';

export default function Base64Page() {
  const { t } = useI18n();
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
        setError(t('tools.base64.errorDecode'));
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
      <Title level={3}><LockOutlined /> {t('tools.base64.title')}</Title>
      <Segmented
        options={[
          { label: t('tools.base64.encode'), value: 'encode' },
          { label: t('tools.base64.decode'), value: 'decode' },
        ]}
        value={mode}
        onChange={(val) => setMode(val as Mode)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title={t('common.input')} size="small">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder={t('tools.base64.placeholder')}
          />
        </Card>
        <Card title={t('common.output')} size="small" extra={
          <Space>
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
            <Button icon={<ReloadOutlined />} onClick={handleSwap} />
          </Space>
        }>
          <TextArea value={output} rows={10} readOnly placeholder={t('tools.base64.resultPlaceholder')} />
        </Card>
      </div>
      <Space>
        <Button type="primary" onClick={handleTransform}>
          {mode === 'encode' ? t('tools.base64.encode') : t('tools.base64.decode')}
        </Button>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          {t('common.clear')}
        </Button>
      </Space>
      {error && <Alert type="error" message={error} showIcon />}
    </div>
  );
}
