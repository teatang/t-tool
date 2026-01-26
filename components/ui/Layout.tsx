'use client';

import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ToolOutlined,
  CodeOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useAppSelector } from '@/lib/store/hooks';

// 布局组件拆解
const { Header, Sider, Content } = AntLayout;

/** 应用布局 Props 接口 */
interface AppLayoutProps {
  children: React.ReactNode;  // 子组件
}

/** 工具菜单项配置 */
const toolMenuItems = [
  {
    key: '/tools/base64',
    icon: <KeyOutlined />,
    label: <Link href="/tools/base64">Base64</Link>,
  },
  {
    key: '/tools/url-encoder',
    icon: <Link href="/tools/url-encoder" />,
    label: <Link href="/tools/url-encoder">URL 编码</Link>,
  },
  {
    key: '/tools/json-formatter',
    icon: <CodeOutlined />,
    label: <Link href="/tools/json-formatter">JSON 格式化</Link>,
  },
  {
    key: '/tools/html-formatter',
    icon: <FileTextOutlined />,
    label: <Link href="/tools/html-formatter">HTML 格式化</Link>,
  },
  {
    key: '/tools/sql-formatter',
    icon: <CodeOutlined />,
    label: <Link href="/tools/sql-formatter">SQL 格式化</Link>,
  },
  {
    key: '/tools/regex-tester',
    icon: <ToolOutlined />,
    label: <Link href="/tools/regex-tester">正则测试</Link>,
  },
  {
    key: '/tools/mermaid',
    icon: <FileTextOutlined />,
    label: <Link href="/tools/mermaid">Mermaid</Link>,
  },
  {
    key: '/tools/timestamp',
    icon: <ClockCircleOutlined />,
    label: <Link href="/tools/timestamp">时间戳</Link>,
  },
  {
    key: '/tools/uuid',
    icon: <KeyOutlined />,
    label: <Link href="/tools/uuid">UUID</Link>,
  },
];

/**
 * 应用布局组件
 * 包含侧边栏导航、顶部栏和主要内容区域
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);  // 侧边栏是否折叠
  const pathname = usePathname();                      // 当前路径
  const { mode } = useAppSelector((state) => state.theme);  // 获取主题模式
  const isDark = mode === 'dark';
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();                                // Ant Design 主题 token

  // 主菜单配置
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">首页</Link>,
    },
    {
      key: 'tools',
      icon: <ToolOutlined />,
      label: '工具箱',
      children: toolMenuItems,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={isDark ? 'dark' : 'light'}
      >
        {/* Logo 区域 */}
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#fff',
          fontSize: collapsed ? 12 : 16,
        }}>
          {collapsed ? 'TT' : '工具箱'}
        </div>
        {/* 导航菜单 */}
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      {/* 主布局 */}
      <AntLayout>
        {/* 顶部栏 */}
        <Header style={{
          padding: '0 16px',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* 侧边栏折叠按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          {/* 主题切换按钮 */}
          <ThemeToggle />
        </Header>
        {/* 主内容区域 */}
        <Content
          style={{
            margin: 16,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
