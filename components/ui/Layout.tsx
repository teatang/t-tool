'use client';

import React, { useState, useMemo } from 'react';
import { Layout as AntLayout, Menu, Button, theme, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FontSizeOutlined,
  LockOutlined,
  LinkOutlined,
  CodeOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  BlockOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAppSelector } from '@/lib/store/hooks';
import { useI18n } from '@/contexts/I18nContext';

// 布局组件拆解
const { Header, Sider, Content } = AntLayout;

/** 应用布局 Props 接口 */
interface AppLayoutProps {
  children: React.ReactNode;  // 子组件
}

/**
 * 获取字符串工具菜单项
 */
function getStringToolItems(t: (key: string) => string) {
  return [
    { key: '/tools/base64', icon: <LockOutlined />, label: <Link href="/tools/base64">{t('tools.base64.name')}</Link> },
    { key: '/tools/url-encoder', icon: <LinkOutlined />, label: <Link href="/tools/url-encoder">{t('tools.urlEncoder.name')}</Link> },
    { key: '/tools/json-formatter', icon: <CodeOutlined />, label: <Link href="/tools/json-formatter">{t('tools.jsonFormatter.name')}</Link> },
    { key: '/tools/html-formatter', icon: <FileTextOutlined />, label: <Link href="/tools/html-formatter">{t('tools.htmlFormatter.name')}</Link> },
    { key: '/tools/sql-formatter', icon: <DatabaseOutlined />, label: <Link href="/tools/sql-formatter">{t('tools.sqlFormatter.name')}</Link> },
    { key: '/tools/regex-tester', icon: <ExperimentOutlined />, label: <Link href="/tools/regex-tester">{t('tools.regexTester.name')}</Link> },
  ];
}

/**
 * 获取其他工具菜单项
 */
function getOtherToolItems(t: (key: string) => string) {
  return [
    { key: '/tools/mermaid', icon: <BlockOutlined />, label: <Link href="/tools/mermaid">{t('tools.mermaid.name')}</Link> },
    { key: '/tools/timestamp', icon: <ClockCircleOutlined />, label: <Link href="/tools/timestamp">{t('tools.timestamp.name')}</Link> },
    { key: '/tools/uuid', icon: <IdcardOutlined />, label: <Link href="/tools/uuid">{t('tools.uuid.name')}</Link> },
  ];
}

/**
 * 应用布局组件
 * 包含侧边栏导航、顶部栏和主要内容区域
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);  // 侧边栏是否折叠
  const pathname = usePathname();                      // 当前路径
  const { locale, t } = useI18n();
  const { isDark } = useAppSelector((state) => state.theme);  // 从 store 直接获取 isDark
  const isZh = locale === 'zh';
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 侧边栏背景色（使用与主布局一致的颜色）
  const siderBg = isDark ? '#141414' : '#fff';

  // 字符串工具菜单项
  const stringToolItems = useMemo(() => getStringToolItems(t), [t]);

  // 其他工具菜单项
  const otherToolItems = useMemo(() => getOtherToolItems(t), [t]);

  // 主菜单配置
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">{isZh ? '首页' : 'Home'}</Link>,
    },
    {
      key: 'stringTools',
      icon: <FontSizeOutlined />,
      label: t('menu.stringTools'),
      children: stringToolItems,
    },
    {
      key: 'otherTools',
      icon: <AppstoreOutlined />,
      label: t('menu.otherTools'),
      children: otherToolItems,
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
        style={{
          background: siderBg,
        }}
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
          {collapsed ? 'TT' : (isZh ? '工具箱' : 'Tools')}
        </div>
        {/* 导航菜单 */}
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{
            background: siderBg,
          }}
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
          {/* 左侧：折叠按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          {/* 右侧：语言切换和主题切换 */}
          <Space>
            <LanguageSwitcher />
            <ThemeToggle />
          </Space>
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
