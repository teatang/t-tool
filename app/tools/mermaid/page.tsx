'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Alert, Select } from 'antd';
import { CopyOutlined, FullscreenOutlined } from '@ant-design/icons';
import { mermaidParse } from '@/utils/other/mermaid';

const { Title, Text } = Typography;
const { TextArea } = Input;

const diagramTypes = [
  { value: 'graph', label: '流程图 (TD)' },
  { value: 'flowchart', label: '流程图' },
  { value: 'sequenceDiagram', label: '时序图' },
  { value: 'classDiagram', label: '类图' },
  { value: 'stateDiagram', label: '状态图' },
  { value: 'erDiagram', label: 'ER 图' },
  { value: 'pie', label: '饼图' },
  { value: 'gantt', label: '甘特图' },
  { value: 'journey', label: '用户旅程' },
];

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

export default function MermaidPage() {
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
      setError(result.error || '语法错误');
    } else {
      setError('');
    }
  }, [code]);

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
      <Title level={3}>Mermaid 图表编辑器</Title>
      <div className="flex items-center gap-4">
        <Text>模板:</Text>
        <Select
          value={diagramType}
          onChange={handleTemplateChange}
          options={diagramTypes}
          style={{ width: 200 }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="编辑器" size="small" extra={
          <Space>
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
            <Button icon={<FullscreenOutlined />} onClick={handleFullscreen} />
          </Space>
        }>
          <TextArea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={15}
            placeholder="请输入 Mermaid 图表代码..."
            style={{ fontFamily: 'monospace' }}
          />
        </Card>
        <Card title="预览" size="small">
          <div className="min-h-[300px] flex items-center justify-center">
            {error ? (
              <Alert type="error" message="语法错误" description={error} />
            ) : code ? (
              <div className="text-center text-gray-500">
                <Text>图表预览将显示在这里</Text>
                <br />
                <Text type="secondary">使用 Mermaid 在线编辑器查看完整预览</Text>
              </div>
            ) : (
              <Text type="secondary">请输入 Mermaid 代码查看预览</Text>
            )}
          </div>
        </Card>
      </div>
      {error && <Alert type="error" message="语法错误" description={error} showIcon />}
    </div>
  );
}
