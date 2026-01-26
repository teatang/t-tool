'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Input as AntInput, Button, Space, Typography, Row, Col, Divider } from 'antd';
import { CopyOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { timestampToDate, dateToTimestamp, getCurrentTimestamp } from '@/utils/other/timestamp';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;

export default function TimestampPage() {
  const { t } = useI18n();
  const [unixTimestamp, setUnixTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [result, setResult] = useState<ReturnType<typeof timestampToDate> | null>(null);
  const [error, setError] = useState('');
  const isUpdatingFromRef = useRef<'unix' | 'date' | null>(null);

  // 从 Unix 时间戳更新
  const updateFromUnix = useCallback((ts: string) => {
    const num = parseInt(ts);
    if (isNaN(num) || ts === '') {
      setResult(null);
      if (ts !== '') {
        setError(t('tools.timestamp.errorInvalidTimestamp'));
      } else {
        setError('');
      }
      return;
    }
    const data = timestampToDate(num);
    setResult(data);
    isUpdatingFromRef.current = 'unix';
    setDateString(data.iso);
    isUpdatingFromRef.current = null;
    setError('');
  }, [t]);

  // 从日期字符串更新
  const updateFromDate = useCallback((date: string) => {
    if (date === '') {
      setResult(null);
      setError('');
      return;
    }
    const result = dateToTimestamp(date);
    if (result.success && result.result) {
      setResult(result.result);
      isUpdatingFromRef.current = 'date';
      setUnixTimestamp(result.result.unix.toString());
      isUpdatingFromRef.current = null;
      setError('');
    } else {
      setError(result.error || t('tools.timestamp.errorInvalidDate'));
    }
  }, [t]);

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

  // Unix 时间戳变化时自动更新
  useEffect(() => {
    if (isUpdatingFromRef.current !== 'unix') {
      updateFromUnix(unixTimestamp);
    }
  }, [unixTimestamp, updateFromUnix]);

  // 日期字符串变化时自动更新
  useEffect(() => {
    if (isUpdatingFromRef.current !== 'date') {
      updateFromDate(dateString);
    }
  }, [dateString, updateFromDate]);

  return (
    <div className="space-y-4">
      <Title level={3}><ClockCircleOutlined /> {t('tools.timestamp.title')}</Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title={t('tools.timestamp.unixTimestamp')} size="small">
            <AntInput
              value={unixTimestamp}
              onChange={(e) => setUnixTimestamp(e.target.value)}
              placeholder={t('tools.timestamp.placeholderUnix')}
              suffix={t('tools.timestamp.milliseconds')}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('tools.timestamp.dateString')} size="small" extra={
            <Button icon={<ReloadOutlined />} onClick={handleNow} />
          }>
            <AntInput
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              placeholder={t('tools.timestamp.placeholderDate')}
            />
          </Card>
        </Col>
      </Row>
      {error && <Text type="danger">{error}</Text>}
      {result && (
        <Card title={t('common.result')} size="small">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Divider orientation="left">{t('tools.timestamp.unix')}</Divider>
              <div className="flex items-center gap-2">
                <Text strong className="text-lg">{result.unix}</Text>
                <Text type="secondary">{t('tools.timestamp.milliseconds')}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(result.unix.toString())} />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text type="secondary">{t('tools.timestamp.formatted')}</Text>
              <div className="flex items-center gap-2">
                <Text code>{result.formatted}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(result.formatted)} />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text type="secondary">{t('tools.timestamp.iso8601')}</Text>
              <div className="flex items-center gap-2">
                <Text code>{result.iso}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(result.iso)} />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text type="secondary">{t('tools.timestamp.utc')}</Text>
              <div className="flex items-center gap-2">
                <Text code>{result.utc}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(result.utc)} />
              </div>
            </Col>
            <Col span={24}>
              <Text type="secondary">{t('tools.timestamp.local')}</Text>
              <div className="flex items-center gap-2">
                <Text>{result.local}</Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}
      <Card title={t('tools.timestamp.quickActions')} size="small">
        <Space wrap>
          <Button onClick={handleNow}>{t('tools.timestamp.getCurrent')}</Button>
          <Button onClick={() => setUnixTimestamp(Math.floor(Date.now() / 1000).toString())}>
            {t('tools.timestamp.currentSeconds')}
          </Button>
        </Space>
      </Card>
    </div>
  );
}
