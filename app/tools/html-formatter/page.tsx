'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Alert } from 'antd';
import { CopyOutlined, FileTextOutlined } from '@ant-design/icons';
import { htmlFormat, htmlMinify } from '@/utils/string/html';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'format' | 'minify';

export default function HtmlFormatterPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (input.trim()) {
      try {
        if (mode === 'format') {
          setOutput(htmlFormat(input));
        } else {
          setOutput(htmlMinify(input));
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
      <Title level={3}><FileTextOutlined /> {t('tools.htmlFormatter.title')}</Title>
      <Segmented
        options={[
          { label: t('tools.htmlFormatter.format'), value: 'format' },
          { label: t('tools.htmlFormatter.minify'), value: 'minify' },
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
            placeholder={t('tools.htmlFormatter.placeholder')}
          />
        </Card>
        <Card title={t('common.output')} size="small" extra={
          output && <Button icon={<CopyOutlined />} onClick={handleCopy} />
        }>
          <TextArea value={output} rows={10} readOnly />
        </Card>
      </div>
      <Space>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          {t('common.clear')}
        </Button>
      </Space>
      {error && <Alert type="error" message={error} showIcon />}
    </div>
  );
}
