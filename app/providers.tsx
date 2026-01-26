'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { AppLayout } from '@/components/ui/Layout';
import { ConfigProvider, theme } from 'antd';
import { useAppSelector } from '@/lib/store/hooks';
import { useThemeInit } from '@/hooks/useThemeInit';
import { I18nProvider } from '@/contexts/I18nContext';
import { AntdRegistry } from './AntdRegistry';

function AntdProvider({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

function ThemeInitializer() {
  useThemeInit();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeInitializer />
      <I18nProvider>
        <AntdProvider>
          <AntdRegistry>
            <AppLayout>{children}</AppLayout>
          </AntdRegistry>
        </AntdProvider>
      </I18nProvider>
    </Provider>
  );
}

// 导出通用翻译键供客户端使用
export const localeLabels = {
  en: 'EN',
  zh: '中文',
} as const;
