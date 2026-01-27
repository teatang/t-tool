'use client';

import { useLayoutEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setThemeMode, ThemeMode } from '@/lib/store/slices/themeSlice';

/**
 * 主题初始化 Hook
 * 在应用启动时根据 localStorage 或系统设置初始化主题
 * 使用 useLayoutEffect 避免 hydration 不匹配
 */
export function useThemeInit() {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    // 优先从 localStorage 读取保存的主题设置
    const savedMode = localStorage.getItem('theme') as ThemeMode | null;
    if (savedMode) {
      dispatch(setThemeMode(savedMode));
    } else {
      // 默认跟随系统模式
      dispatch(setThemeMode('system'));
    }
  }, [dispatch]);
}
