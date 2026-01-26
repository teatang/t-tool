'use client';

import { useRef } from 'react';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';

/**
 * Antd 样式注册组件
 * 用于静态导出版本 - 简化版
 */
interface AntdRegistryProps {
  children: React.ReactNode;
}

export function AntdRegistry({ children }: AntdRegistryProps) {
  const cacheRef = useRef<Entity | null>(null);

  // 只在客户端创建一次缓存
  if (typeof window !== 'undefined' && !cacheRef.current) {
    cacheRef.current = createCache();
  }

  // 客户端使用 StyleProvider
  if (typeof window !== 'undefined') {
    return <StyleProvider cache={cacheRef.current!}>{children}</StyleProvider>;
  }

  // 服务端直接渲染子组件
  return <>{children}</>;
}
