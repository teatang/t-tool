'use client';

import { Button, Space, Tooltip } from 'antd';
import { useTheme } from '@/hooks/useTheme';
import { BulbOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons';

/**
 * 主题切换按钮组件
 * 提供浅色/深色/系统三种主题切换按钮
 */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  // 主题图标映射
  const icons = {
    light: <BulbOutlined />,      // 浅色模式图标（灯泡）
    dark: <MoonOutlined />,        // 深色模式图标（月亮）
    system: <DesktopOutlined />,   // 系统模式图标（显示器）
  };

  // 主题标签映射
  const labels = {
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
  };

  return (
    <Space.Compact>
      {(['light', 'dark', 'system'] as const).map((m) => (
        <Tooltip key={m} title={labels[m]}>
          <Button
            type={mode === m ? 'primary' : 'default'}
            icon={icons[m]}
            onClick={() => setMode(m)}
          />
        </Tooltip>
      ))}
    </Space.Compact>
  );
}
