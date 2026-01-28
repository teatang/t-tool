'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Input as AntInput, Button, Space, Typography, Row, Col, Divider } from 'antd';
import { CopyOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { timestampToDate, dateToTimestamp, getCurrentTimestamp } from '@/utils/other/timestamp';
import { useI18n } from '@/contexts/I18nContext';

// 禁用静态预渲染，因为页面依赖客户端 i18n 上下文
export const dynamic = 'force-dynamic';

const { Title, Text } = Typography;

export default function TimestampPage() {
  const { t } = useI18n();
  const [unixTimestamp, setUnixTimestamp] = useState(() => Date.now().toString());
  const [dateString, setDateString] = useState('');
  const [result, setResult] = useState<ReturnType<typeof timestampToDate> | null>(null);
  const [error, setError] = useState('');

  // 初始化时显示当前时间
  useEffect(() => {
    const now = getCurrentTimestamp();
    setUnixTimestamp(now.unix.toString());
    setDateString(now.iso);
    setResult(now);
  }, []);

  // 从 Unix 时间戳更新日期
  const updateDateFromUnix = useCallback((ts: string) => {
    const num = parseInt(ts);
    if (isNaN(num) || ts === '') {
      setDateString('');
      setResult(null);
      if (ts !== '') {
        setError(t('tools.timestamp.errorInvalidTimestamp'));
      } else {
        setError('');
      }
      return;
    }
    // 检测是否为秒级时间戳（小于10^12），如果是则转换为毫秒
    const timestamp = num < 1000000000000 ? num * 1000 : num;
    const data = timestampToDate(timestamp);
    setResult(data);
    setDateString(data.iso);
    setError('');
  }, [t]);

  // 从日期字符串更新 Unix 时间戳
  const updateUnixFromDate = useCallback((date: string) => {
    if (date === '') {
      setResult(null);
      setError('');
      return;
    }
    const result = dateToTimestamp(date);
    if (result.success && result.result) {
      setResult(result.result);
      setUnixTimestamp(result.result.unix.toString());
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

  const handleUnixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ts = e.target.value;
    setUnixTimestamp(ts);
    updateDateFromUnix(ts);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setDateString(date);
    updateUnixFromDate(date);
  };

  return (
    <div className="space-y-4">
      <Title level={3}><ClockCircleOutlined /> {t('tools.timestamp.title')}</Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title={t('tools.timestamp.unixTimestamp')} size="small">
            <AntInput
              value={unixTimestamp}
              onChange={handleUnixChange}
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
              onChange={handleDateChange}
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
        </Space>
      </Card>
    </div>
  );
}
