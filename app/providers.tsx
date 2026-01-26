'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { AppLayout } from '@/components/ui/Layout';
import { ConfigProvider, theme } from 'antd';
import { useAppSelector } from '@/lib/store/hooks';
import { useThemeInit } from '@/hooks/useThemeInit';

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
      <AntdProvider>
        <AppLayout>{children}</AppLayout>
      </AntdProvider>
    </Provider>
  );
}
