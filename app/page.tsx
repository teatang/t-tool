'use client';

import { useI18n } from '@/contexts/I18nContext';
import { Card, Row, Col, Typography } from 'antd';
import Link from 'next/link';
import {
  LockOutlined,
  LinkOutlined,
  CodeOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  BlockOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

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

export default function HomePage() {
  const { t } = useI18n();

  const tools = [
    { href: '/tools/base64', title: 'Base64', description: t('tools.base64.title'), icon: <LockOutlined /> },
    { href: '/tools/url-encoder', title: 'URL 编码', description: t('tools.urlEncoder.title'), icon: <LinkOutlined /> },
    { href: '/tools/json-formatter', title: 'JSON 格式化', description: t('tools.jsonFormatter.title'), icon: <CodeOutlined /> },
    { href: '/tools/html-formatter', title: 'HTML 格式化', description: t('tools.htmlFormatter.title'), icon: <FileTextOutlined /> },
    { href: '/tools/sql-formatter', title: 'SQL 格式化', description: t('tools.sqlFormatter.title'), icon: <DatabaseOutlined /> },
    { href: '/tools/regex-tester', title: '正则测试', description: t('tools.regexTester.title'), icon: <ExperimentOutlined /> },
    { href: '/tools/mermaid', title: 'Mermaid', description: t('tools.mermaid.title'), icon: <BlockOutlined /> },
    { href: '/tools/timestamp', title: '时间戳', description: t('tools.timestamp.title'), icon: <ClockCircleOutlined /> },
    { href: '/tools/uuid', title: 'UUID', description: t('tools.uuid.title'), icon: <IdcardOutlined /> },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title level={2}>{t('home.title')}</Title>
        <Paragraph className="text-gray-500">
          {t('home.subtitle')}
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
