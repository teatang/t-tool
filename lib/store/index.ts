import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';

/**
 * Redux Store 配置
 * 包含所有 reducer
 */
export const store = configureStore({
  reducer: {
    theme: themeReducer,  // 主题 reducer
  },
});

// 类型导出，供整个应用使用
export type RootState = ReturnType<typeof store.getState>;  // RootState 类型
export type AppDispatch = typeof store.dispatch;             // AppDispatch 类型
