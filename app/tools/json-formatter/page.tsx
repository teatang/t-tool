'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Alert, Tag } from 'antd';
import { CopyOutlined, CodeOutlined } from '@ant-design/icons';
import { jsonFormat, jsonMinify, jsonValidate } from '@/utils/string/json';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title } = Typography;
const { TextArea } = Input;

type Mode = 'format' | 'minify' | 'validate';

export default function JsonFormatterPage() {
  const { t } = useI18n();
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
      <Title level={3}><CodeOutlined /> {t('tools.jsonFormatter.title')}</Title>
      <Segmented
        options={[
          { label: t('tools.jsonFormatter.format'), value: 'format' },
          { label: t('tools.jsonFormatter.minify'), value: 'minify' },
          { label: t('tools.jsonFormatter.validate'), value: 'validate' },
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
            placeholder={t('tools.jsonFormatter.placeholder')}
          />
        </Card>
        <Card title={t('common.output')} size="small" extra={
          mode !== 'validate' && output && (
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
          )
        }>
          {mode === 'validate' ? (
            <div className="py-4">
              {status === 'valid' && <Tag color="success">{t('tools.jsonFormatter.validJson')}</Tag>}
              {status === 'invalid' && <Tag color="error">{t('tools.jsonFormatter.invalidJson')}</Tag>}
            </div>
          ) : (
            <TextArea value={output} rows={10} readOnly />
          )}
        </Card>
      </div>
      <Space>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); setStatus(''); }}>
          {t('common.clear')}
        </Button>
      </Space>
      {error && <Alert type="error" message={error} showIcon />}
    </div>
  );
}
