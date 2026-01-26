'use client';

import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Segmented } from 'antd';
import { CopyOutlined, ReloadOutlined, LinkOutlined } from '@ant-design/icons';
import { urlEncode, urlDecode } from '@/utils/string/url';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'encode' | 'decode';

export default function UrlEncoderPage() {
  const { t } = useI18n();
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
      <Title level={3}><LinkOutlined /> {t('tools.urlEncoder.title')}</Title>
      <Segmented
        options={[
          { label: t('tools.urlEncoder.encode'), value: 'encode' },
          { label: t('tools.urlEncoder.decode'), value: 'decode' },
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
            placeholder={t('tools.urlEncoder.placeholder')}
          />
        </Card>
        <Card title={t('common.output')} size="small" extra={
          <Space>
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
            <Button icon={<ReloadOutlined />} onClick={handleSwap} />
          </Space>
        }>
          <TextArea value={output} rows={10} readOnly placeholder={t('tools.urlEncoder.resultPlaceholder')} />
        </Card>
      </div>
      <Space>
        <Button type="primary" onClick={handleTransform}>
          {mode === 'encode' ? t('tools.urlEncoder.encode') : t('tools.urlEncoder.decode')}
        </Button>
        <Button onClick={() => { setInput(''); setOutput(''); }}>
          {t('common.clear')}
        </Button>
      </Space>
    </div>
  );
}
