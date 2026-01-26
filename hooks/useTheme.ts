import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setThemeMode, ThemeMode } from '@/lib/store/slices/themeSlice';

/**
 * 主题管理 Hook
 * 提供主题切换、设置等功能
 * @returns {mode, isDark, setMode, toggleMode} 主题相关的状态和方法
 */
export function useTheme() {
  const dispatch = useAppDispatch();
  const { mode, isDark } = useAppSelector((state) => state.theme);

  // 同步主题状态到 localStorage
  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  // 监听系统主题变化（仅在系统模式下生效）
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      dispatch(setThemeMode('system'));
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, dispatch]);

  /**
   * 设置主题模式
   * @param newMode 新的主题模式
   */
  const setMode = (newMode: ThemeMode) => {
    dispatch(setThemeMode(newMode));
  };

  /**
   * 切换主题模式
   * 循环切换：light -> dark -> system -> light
   */
  const toggleMode = () => {
    dispatch(setThemeMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'));
  };

  return { mode, isDark, setMode, toggleMode };
}
