'use client';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

/**
 * Antd 样式注册组件
 * 用于解决 Next.js SSR 时的 hydration 不匹配问题
 * 支持主题切换时重新生成样式
 */
interface AntdRegistryProps {
  children: React.ReactNode;
}

export function AntdRegistry({ children }: AntdRegistryProps) {
  const cacheRef = useRef<Entity | null>(null);
  const [themeVersion, setThemeVersion] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [cache, setCache] = useState<Entity | null>(null);

  // 标记客户端
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 当客户端准备好时，重新创建缓存
  useEffect(() => {
    if (isClient) {
      const newCache = createCache();
      cacheRef.current = newCache;
      setCache(newCache);
      setThemeVersion(v => v + 1);
    }
  }, [isClient]);

  // 监听主题变化
  useEffect(() => {
    if (!isClient) return;

    const observer = new MutationObserver(() => {
      // 强制重新创建缓存
      const newCache = createCache();
      cacheRef.current = newCache;
      setCache(newCache);
      setThemeVersion(v => v + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [isClient]);

  // SSR 时不渲染样式
  useServerInsertedHTML(() => {
    if (!isClient || !cache) return null;
    return (
      <style
        id="antd"
        key={themeVersion}
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  if (!isClient) {
    return <>{children}</>;
  }

  return <StyleProvider cache={cache || undefined}>{children}</StyleProvider>;
}
