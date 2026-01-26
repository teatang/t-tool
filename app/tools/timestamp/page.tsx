'use client';

import { useState, useEffect } from 'react';
import { Card, Input as AntInput, Button, Space, Typography, Row, Col, Divider } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { timestampToDate, dateToTimestamp, getCurrentTimestamp } from '@/utils/other/timestamp';

const { Title, Text } = Typography;

export default function TimestampPage() {
  const [unixTimestamp, setUnixTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [result, setResult] = useState<ReturnType<typeof timestampToDate> | null>(null);
  const [error, setError] = useState('');

  const updateFromUnix = (ts: string) => {
    const num = parseInt(ts);
    if (isNaN(num)) {
      setResult(null);
      setError('无效的时间戳');
      return;
    }
    const data = timestampToDate(num);
    setResult(data);
    setDateString(data.iso);
    setError('');
  };

  const updateFromDate = (date: string) => {
    const result = dateToTimestamp(date);
    if (result.success && result.result) {
      setResult(result.result);
      setUnixTimestamp(result.result.unix.toString());
      setError('');
    } else {
      setError(result.error || '无效的日期格式');
    }
  };

  const handleNow = () => {
    const now = getCurrentTimestamp();
    setUnixTimestamp(now.unix.toString());
    setDateString(now.iso);
    setResult(now);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  
  useEffect(() => {
    if (unixTimestamp && !dateString) {
      updateFromUnix(unixTimestamp);
    }
  }, [unixTimestamp, dateString]);

  
  useEffect(() => {
    if (dateString && !unixTimestamp) {
      updateFromDate(dateString);
    }
  }, [dateString, unixTimestamp]);

  return (
    <div className="space-y-4">
      <Title level={3}>时间戳转换</Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Unix 时间戳" size="small">
            <AntInput
              value={unixTimestamp}
              onChange={(e) => setUnixTimestamp(e.target.value)}
              placeholder="请输入 Unix 时间戳..."
              suffix="毫秒"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="日期字符串" size="small" extra={
            <Button icon={<ReloadOutlined />} onClick={handleNow} />
          }>
            <AntInput
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              placeholder="请输入日期字符串 (ISO, UTC 等)..."
            />
          </Card>
        </Col>
      </Row>
      {error && <Text type="danger">{error}</Text>}
      {result && (
        <Card title="结果" size="small">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Divider orientation="left">Unix 时间戳</Divider>
              <div className="flex items-center gap-2">
                <Text strong className="text-lg">{result.unix}</Text>
                <Text type="secondary">(毫秒)</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(result.unix.toString())} />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text type="secondary">ISO 8601:</Text>
              <div className="flex items-center gap-2">
                <Text code>{result.iso}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(result.iso)} />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text type="secondary">UTC:</Text>
              <div className="flex items-center gap-2">
                <Text code>{result.utc}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(result.utc)} />
              </div>
            </Col>
            <Col span={24}>
              <Text type="secondary">本地时间:</Text>
              <div className="flex items-center gap-2">
                <Text>{result.local}</Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}
      <Card title="快捷操作" size="small">
        <Space wrap>
          <Button onClick={handleNow}>获取当前时间戳</Button>
          <Button onClick={() => setUnixTimestamp(Math.floor(Date.now() / 1000).toString())}>
            当前 (秒)
          </Button>
        </Space>
      </Card>
    </div>
  );
}
