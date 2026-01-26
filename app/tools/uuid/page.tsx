'use client';

import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Row, Col, Select, Table, Tag } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { generateUUID, generateMultipleUUIDs, uuidVersions, isValidUUID } from '@/utils/other/uuid';

const { Title, Text } = Typography;

export default function UuidPage() {
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
      title: '有效',
      key: 'valid',
      width: 80,
      render: (_: unknown, record: { uuid: string }) => (
        <Tag color={isValidUUID(record.uuid) ? 'success' : 'error'}>
          {isValidUUID(record.uuid) ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '操作',
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
      <Title level={3}>UUID 生成器</Title>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card title="设置" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>版本:</Text>
                <Select
                  value={version}
                  onChange={setVersion}
                  options={uuidVersions}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </div>
              <div>
                <Text strong>批量数量:</Text>
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
          <Card title="生成" size="small">
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleGenerate}>
                生成一个
              </Button>
              <Button icon={<PlusOutlined />} onClick={handleBatchGenerate}>
                生成 {batchCount} 个
              </Button>
              {generatedUUIDs.length > 0 && (
                <>
                  <Button onClick={handleCopyAll}>复制全部</Button>
                  <Button danger onClick={handleClear}>清空</Button>
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
      {generatedUUIDs.length > 0 && (
        <Card title={`已生成 UUID (${generatedUUIDs.length})`} size="small">
          <Table
            dataSource={generatedUUIDs.map((uuid, index) => ({ uuid, key: index }))}
            columns={columns}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>
      )}
      <Card title="版本说明" size="small">
        <Row gutter={16}>
          {uuidVersions.map((v) => (
            <Col xs={24} sm={12} md={6} key={v.version}>
              <Text strong>UUID v{v.version}:</Text>
              <div><Text type="secondary">{v.name}</Text></div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
