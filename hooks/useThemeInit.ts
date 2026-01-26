'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setThemeMode, ThemeMode } from '@/lib/store/slices/themeSlice';

/**
 * 主题初始化 Hook
 * 在应用启动时根据 localStorage 或系统设置初始化主题
 */
export function useThemeInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 优先从 localStorage 读取保存的主题设置
    const savedMode = localStorage.getItem('theme') as ThemeMode | null;
    if (savedMode) {
      dispatch(setThemeMode(savedMode));
    } else {
      // 否则根据系统设置判断
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setThemeMode(systemDark ? 'dark' : 'light'));
    }
  }, [dispatch]);
}
