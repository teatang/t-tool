'use client';

import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Row, Col, Select, Table, Tag } from 'antd';
import { DeleteOutlined, PlusOutlined, IdcardOutlined } from '@ant-design/icons';
import { generateUUID, generateMultipleUUIDs, uuidVersions, isValidUUID } from '@/utils/other/uuid';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;

export default function UuidPage() {
  const { t } = useI18n();
  const [version, setVersion] = useState<number>(4);
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState(10);

  const handleGenerate = () => {
    const uuid = generateUUID(version);
    setGeneratedUUIDs([uuid, ...generatedUUIDs]);
  };

  const handleBatchGenerate = () => {
    const uuids = generateMultipleUUIDs(batchCount, version);
    setGeneratedUUIDs([...uuids, ...generatedUUIDs]);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatedUUIDs.join('\n'));
  };

  const handleClear = () => {
    setGeneratedUUIDs([]);
  };

  const handleDelete = (index: number) => {
    setGeneratedUUIDs(generatedUUIDs.filter((_, i) => i !== index));
  };

  const versionOptions = uuidVersions.map(v => ({
    value: v.version,
    label: `UUID v${v.version}: ${t(`tools.uuid.v${v.version}`)}`,
  }));

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      key: 'uuid',
      render: (uuid: string) => (
        <div className="font-mono text-sm">{uuid}</div>
      ),
    },
    {
      title: t('common.valid'),
      key: 'valid',
      width: 80,
      render: (_: unknown, record: { uuid: string }) => (
        <Tag color={isValidUUID(record.uuid) ? 'success' : 'error'}>
          {isValidUUID(record.uuid) ? t('common.yes') : t('common.no')}
        </Tag>
      ),
    },
    {
      title: t('common.action'),
      key: 'action',
      width: 80,
      render: (_: unknown, __: unknown, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(index)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Title level={3}><IdcardOutlined /> {t('tools.uuid.title')}</Title>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card title={t('common.settings')} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>{t('common.version')}:</Text>
                <Select
                  value={version}
                  onChange={setVersion}
                  options={versionOptions}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </div>
              <div>
                <Text strong>{t('common.batchCount')}:</Text>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                  style={{ marginTop: 8 }}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title={t('tools.uuid.generate')} size="small">
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleGenerate}>
                {t('common.generateOne')}
              </Button>
              <Button icon={<PlusOutlined />} onClick={handleBatchGenerate}>
                {t('common.generateCount', { count: batchCount })}
              </Button>
              {generatedUUIDs.length > 0 && (
                <>
                  <Button onClick={handleCopyAll}>{t('common.copyAll')}</Button>
                  <Button danger onClick={handleClear}>{t('common.clear')}</Button>
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
      {generatedUUIDs.length > 0 && (
        <Card title={t('tools.uuid.generatedUuids', { count: generatedUUIDs.length })} size="small">
          <Table
            dataSource={generatedUUIDs.map((uuid, index) => ({ uuid, key: index }))}
            columns={columns}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>
      )}
      <Card title={t('tools.uuid.info')} size="small">
        <Row gutter={16}>
          {uuidVersions.map((v) => (
            <Col xs={24} sm={12} md={6} key={v.version}>
              <Text strong>UUID v{v.version}:</Text>
              <div><Text type="secondary">{t(`tools.uuid.v${v.version}`)}</Text></div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
