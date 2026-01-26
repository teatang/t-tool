'use client';

import { Segmented } from 'antd';
import { useTheme } from '@/hooks/useTheme';
import { BulbOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons';

/**
 * 主题切换组件
 * 提供浅色/深色/系统三种主题切换
 */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const handleChange = (value: string) => {
    setMode(value as 'light' | 'dark' | 'system');
  };

  return (
    <Segmented
      value={mode}
      onChange={handleChange}
      options={[
        { label: <BulbOutlined />, value: 'light' },
        { label: <MoonOutlined />, value: 'dark' },
        { label: <DesktopOutlined />, value: 'system' },
      ]}
    />
  );
}
