'use client';

import { useState, useEffect } from 'react';
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
  const [cache, setCache] = useState<Entity | null>(null);

  // 只在客户端创建一次缓存
  useEffect(() => {
    if (!cache) {
      setCache(createCache());
    }
  }, [cache]);

  // 客户端使用 StyleProvider
  if (typeof window && cache) {
    return <StyleProvider cache={cache}>{children}</StyleProvider>;
  }

  // 服务端或加载中直接渲染子组件
  return <>{children}</>;
}
