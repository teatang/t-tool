import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** 主题模式类型：浅色、深色、系统自动 */
export type ThemeMode = 'light' | 'dark' | 'system';

/** 主题状态接口 */
interface ThemeState {
  mode: ThemeMode;      // 当前主题模式
  isDark: boolean;      // 是否为深色模式
}

/**
 * 获取初始主题模式
 * 优先从 localStorage 读取，否则默认跟随系统
 */
const getInitialTheme = (): ThemeMode => {
  // SSR 时使用固定默认值，避免 hydration 不匹配
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('theme') as ThemeMode | null;
  if (saved) return saved;
  return 'system';
};

/**
 * 根据主题模式判断是否为深色
 * @param mode 主题模式
 * @returns 是否为深色模式
 */
const getIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'light') return false;
  if (mode === 'dark') return true;
  // system 模式在 SSR 时默认为浅色
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/** 初始状态 */
const initialState: ThemeState = {
  mode: getInitialTheme(),
  isDark: getIsDark(getInitialTheme()),
};

/** 主题 Slice */
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * 设置主题模式
     * @param action 新的主题模式
     */
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.isDark = getIsDark(action.payload);
    },
    /**
     * 切换主题模式
     * 循环切换：light -> dark -> system -> light
     */
    toggleTheme: (state) => {
      const modes: ThemeMode[] = ['light', 'dark', 'system'];
      const currentIndex = modes.indexOf(state.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      const nextMode = modes[nextIndex];
      state.mode = nextMode;
      state.isDark = getIsDark(nextMode);
    },
  },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
