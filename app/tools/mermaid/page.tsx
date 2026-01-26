'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Alert, Select } from 'antd';
import { CopyOutlined, FullscreenOutlined, BlockOutlined } from '@ant-design/icons';
import { mermaidParse } from '@/utils/other/mermaid';
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

  useEffect(() => {
    if (!code.trim()) {
      setError('');
      return;
    }
    const result = mermaidParse(code);
    if (!result.success) {
      setError(t('tools.mermaid.syntaxError'));
    } else {
      setError('');
    }
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
          <div className="min-h-[300px] flex items-center justify-center">
            {error ? (
              <Alert type="error" message={t('tools.mermaid.syntaxError')} description={error} />
            ) : code ? (
              <div className="text-center text-gray-500">
                <Text>{t('tools.mermaid.previewPlaceholder')}</Text>
                <br />
                <Text type="secondary">{t('tools.mermaid.previewNote')}</Text>
              </div>
            ) : (
              <Text type="secondary">{t('tools.mermaid.enterCode')}</Text>
            )}
          </div>
        </Card>
      </div>
      {error && <Alert type="error" message={t('tools.mermaid.syntaxError')} description={error} showIcon />}
    </div>
  );
}
