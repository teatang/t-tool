'use client';

import { Card, Row, Col, Typography } from 'antd';
import Link from 'next/link';
import {
  KeyOutlined,
  LinkOutlined,
  CodeOutlined,
  FileTextOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ToolCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function ToolCard({ href, title, description, icon }: ToolCardProps) {
  return (
    <Link href={href}>
      <Card hoverable className="h-full">
        <Card.Meta
          avatar={<span style={{ fontSize: 24 }}>{icon}</span>}
          title={title}
          description={description}
        />
      </Card>
    </Link>
  );
}

const tools = [
  {
    href: '/tools/base64',
    title: 'Base64',
    description: 'Base64 编码和解码工具',
    icon: <KeyOutlined />,
  },
  {
    href: '/tools/url-encoder',
    title: 'URL 编码',
    description: 'URL 组件编码和解码工具',
    icon: <LinkOutlined />,
  },
  {
    href: '/tools/json-formatter',
    title: 'JSON 格式化',
    description: 'JSON 格式化和验证工具',
    icon: <CodeOutlined />,
  },
  {
    href: '/tools/html-formatter',
    title: 'HTML 格式化',
    description: 'HTML 格式化和压缩工具',
    icon: <FileTextOutlined />,
  },
  {
    href: '/tools/sql-formatter',
    title: 'SQL 格式化',
    description: 'SQL 语句格式化工具',
    icon: <DatabaseOutlined />,
  },
  {
    href: '/tools/regex-tester',
    title: '正则测试',
    description: '正则表达式测试和调试工具',
    icon: <ToolOutlined />,
  },
  {
    href: '/tools/mermaid',
    title: 'Mermaid',
    description: 'Mermaid 语法图表编辑器',
    icon: <CodeOutlined />,
  },
  {
    href: '/tools/timestamp',
    title: '时间戳',
    description: '时间戳转换工具',
    icon: <ClockCircleOutlined />,
  },
  {
    href: '/tools/uuid',
    title: 'UUID',
    description: 'UUID 标识符生成工具',
    icon: <KeyOutlined />,
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title level={2}>开发者工具箱</Title>
        <Paragraph className="text-gray-500">
          为开发者精选的在线工具集合
        </Paragraph>
      </div>
      <Row gutter={[16, 16]}>
        {tools.map((tool) => (
          <Col xs={24} sm={12} md={8} lg={6} key={tool.href}>
            <ToolCard {...tool} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
