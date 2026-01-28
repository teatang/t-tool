'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Space, Typography, Alert, Select } from 'antd';
import { CopyOutlined, FullscreenOutlined, BlockOutlined } from '@ant-design/icons';
import { mermaidRender, mermaidValidate, MermaidRenderResult } from '@/utils/other/mermaid';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;
const { TextArea } = Input;

const templates: Record<string, string> = {
  graph: `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B`,
  flowchart: `flowchart TD
    A[Start] --> B{Condition}
    B -->|True| C[Action 1]
    B -->|False| D[Action 2]
    C --> E[End]
    D --> E`,
  sequenceDiagram: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob!
    Bob-->>Alice: Hello Alice!`,
  classDiagram: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }`,
  stateDiagram: `stateDiagram-v2
    [*] --> Active
    Active --> [*]
    Active --> Inactive
    Inactive --> Active`,
  erDiagram: `erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ ADDRESS : has
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : in`,
  pie: `pie title Pets
    "Dogs" : 386
    "Cats" : 85
    "Birds" : 150`,
  gantt: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements :a1, 2024-01-01, 7d
    Design :after a1, 5d
    section Development
    Implementation :2024-01-13, 10d
    Testing :after implementation, 5d`,
};

const diagramTypes = [
  { value: 'graph', label: 'Graph (TD)' },
  { value: 'flowchart', label: 'Flowchart' },
  { value: 'sequenceDiagram', label: 'Sequence Diagram' },
  { value: 'classDiagram', label: 'Class Diagram' },
  { value: 'stateDiagram', label: 'State Diagram' },
  { value: 'erDiagram', label: 'ER Diagram' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'gantt', label: 'Gantt Chart' },
];

export default function MermaidPage() {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [diagramType, setDiagramType] = useState('graph');
  const [error, setError] = useState('');
  const [renderResult, setRenderResult] = useState<MermaidRenderResult | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初始化默认模板
  useEffect(() => {
    if (!code && diagramType && templates[diagramType]) {
      setCode(templates[diagramType]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 渲染图表（防抖）
  useEffect(() => {
    if (!code.trim()) {
      setRenderResult(null);
      setError('');
      return;
    }

    // 防抖渲染
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      setIsRendering(true);
      try {
        const result = await mermaidRender(code);
        setRenderResult(result);
        if (!result.success) {
          setError(result.error || t('tools.mermaid.syntaxError'));
        } else {
          setError('');
        }
      } catch (e) {
        setError((e as Error).message);
        setRenderResult(null);
      } finally {
        setIsRendering(false);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, t]);

  const handleTemplateChange = (value: string) => {
    setDiagramType(value);
    setCode(templates[value] || '');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleFullscreen = () => {
    window.open(`https://mermaid.live/edit?p=${encodeURIComponent(code)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <Title level={3}><BlockOutlined /> {t('tools.mermaid.title')}</Title>
      <div className="flex items-center gap-4">
        <Text>{t('tools.mermaid.template')}</Text>
        <Select
          value={diagramType}
          onChange={handleTemplateChange}
          options={diagramTypes}
          style={{ width: 200 }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title={t('tools.mermaid.editor')} size="small" extra={
          <Space>
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
            <Button icon={<FullscreenOutlined />} onClick={handleFullscreen} />
          </Space>
        }>
          <TextArea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={15}
            placeholder={t('tools.mermaid.placeholder')}
            style={{ fontFamily: 'monospace' }}
          />
        </Card>
        <Card title={t('tools.mermaid.preview')} size="small">
          <div className="min-h-[300px] flex items-center justify-center overflow-auto">
            {!code ? (
              <Text type="secondary">{t('tools.mermaid.enterCode')}</Text>
            ) : error ? (
              <Alert type="error" message={t('tools.mermaid.syntaxError')} description={error} />
            ) : isRendering ? (
              <Text type="secondary">Rendering...</Text>
            ) : renderResult?.success && renderResult.svg ? (
              <div
                className="mermaid-preview"
                dangerouslySetInnerHTML={{ __html: renderResult.svg }}
                style={{ width: '100%', textAlign: 'center' }}
              />
            ) : (
              <Text type="secondary">{t('tools.mermaid.previewPlaceholder')}</Text>
            )}
          </div>
        </Card>
      </div>
      {error && <Alert type="error" message={t('tools.mermaid.syntaxError')} description={error} showIcon />}
    </div>
  );
}
