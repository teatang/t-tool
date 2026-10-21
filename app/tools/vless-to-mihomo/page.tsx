'use client';

import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Segmented, Alert, Tag, message, Tooltip } from 'antd';
import {
  CopyOutlined,
  DownloadOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { vlessToMihomoYaml } from '@/utils';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;
const { TextArea } = Input;

type OutputMode = 'proxies' | 'full';

const SAMPLE_VLESS = [
  'vless://9e14a2f8-9584-482a-a92c-671234567890@us-sample.example.com:443?security=reality&encryption=none&pbk=1s2d3f4g5h6j7k8l9z0x_sample_public_key&sid=12345678&fp=chrome&type=tcp&flow=xtls-rprx-vision&sni=yahoo.com#%F0%9F%87%BA%F0%9F%87%B8%20US%20Reality%20Node',
  'vless://b823e590-7c2a-4581-b514-123456789abc@hk-sample.example.com:8443?security=tls&encryption=none&type=ws&host=hk-sample.example.com&path=%2Fvless-ws&sni=hk-sample.example.com#%F0%9F%87%AD%F0%9F%87%B0%20HK%20WebSocket%20Node',
  'vless://f13a7c64-39d2-4ce0-9842-abcdef123456@jp-sample.example.com:443?security=tls&encryption=none&type=grpc&serviceName=vless-grpc&sni=jp-sample.example.com#%F0%9F%87%AF%F0%9F%87%B5%20JP%20gRPC%20Node',
].join('\n');

export default function VlessToMihomoPage() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<OutputMode>('proxies');
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);

  const runConvert = (text: string, currentMode: OutputMode) => {
    if (!text.trim()) {
      setOutput('');
      setNodeCount(0);
      setErrors([]);
      return;
    }

    const res = vlessToMihomoYaml(text, currentMode);
    setOutput(res.yaml);
    setNodeCount(res.count);
    setErrors(res.errors);
  };

  const handleConvert = () => {
    runConvert(input, mode);
  };

  const handleModeChange = (val: OutputMode) => {
    setMode(val);
    if (input.trim()) {
      runConvert(input, val);
    }
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_VLESS);
    runConvert(SAMPLE_VLESS, mode);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setNodeCount(0);
    setErrors([]);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      message.success(t('tools.vlessToMihomo.copySuccess'));
    } catch {
      message.error('复制失败，请手动选择复制');
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'full' ? 'mihomo-config.yaml' : 'mihomo-proxies.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 头部标题与说明 */}
      <div>
        <Title level={3}>
          <ThunderboltOutlined className="text-blue-500 mr-2" />
          {t('tools.vlessToMihomo.title')}
        </Title>
        <Text type="secondary">
          {t('tools.vlessToMihomo.description')}
        </Text>
      </div>

      {/* 控制栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Space wrap>
          <Text strong>{t('tools.vlessToMihomo.outputMode')}:</Text>
          <Segmented<OutputMode>
            options={[
              { label: t('tools.vlessToMihomo.proxiesOnly'), value: 'proxies' },
              { label: t('tools.vlessToMihomo.fullConfig'), value: 'full' },
            ]}
            value={mode}
            onChange={handleModeChange}
          />
        </Space>
        <Space wrap>
          <Button icon={<FileTextOutlined />} onClick={handleLoadSample}>
            {t('tools.vlessToMihomo.sample')}
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleClear}>
            {t('common.clear')}
          </Button>
        </Space>
      </div>

      {/* 输入与输出卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左侧：输入卡片 */}
        <Card
          title={
            <div className="flex items-center justify-between">
              <span>{t('common.input')}</span>
              {input.trim() && (
                <Text type="secondary" className="text-xs font-normal">
                  {input.trim().split('\n').filter(Boolean).length} 行
                </Text>
              )}
            </div>
          }
          size="small"
        >
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={15}
            placeholder={t('tools.vlessToMihomo.placeholder')}
            className="font-mono text-xs"
          />
        </Card>

        {/* 右侧：输出卡片 */}
        <Card
          title={
            <div className="flex items-center justify-between">
              <span>{t('common.output')}</span>
              {nodeCount > 0 && (
                <Tag color="success">
                  {t('tools.vlessToMihomo.convertedCount').replace('{count}', String(nodeCount))}
                </Tag>
              )}
            </div>
          }
          size="small"
          extra={
            output && (
              <Space>
                <Tooltip title={t('common.copy')}>
                  <Button icon={<CopyOutlined />} size="small" onClick={handleCopy} />
                </Tooltip>
                <Tooltip title={t('tools.vlessToMihomo.download')}>
                  <Button icon={<DownloadOutlined />} size="small" onClick={handleDownload} />
                </Tooltip>
              </Space>
            )
          }
        >
          <TextArea
            value={output}
            rows={15}
            readOnly
            placeholder={t('tools.vlessToMihomo.resultPlaceholder')}
            className="font-mono text-xs"
          />
        </Card>
      </div>

      {/* 底部转换操作 */}
      <Space>
        <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleConvert}>
          {t('tools.vlessToMihomo.convert')}
        </Button>
        {output && (
          <Button icon={<DownloadOutlined />} onClick={handleDownload}>
            {t('tools.vlessToMihomo.download')}
          </Button>
        )}
      </Space>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message="部分链接解析提示"
          description={
            <ul className="list-disc pl-4 mt-1 space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          }
        />
      )}
    </div>
  );
}
