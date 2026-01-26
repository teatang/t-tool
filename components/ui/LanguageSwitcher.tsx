'use client';

import { Segmented } from 'antd';
import { useI18n, localeLabels } from '@/contexts/I18nContext';

/**
 * 语言切换组件
 * 支持中英文切换，默认中文
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <Segmented
      value={locale}
      onChange={(value) => setLocale(value as 'zh' | 'en')}
      options={[
        { label: localeLabels.zh, value: 'zh' },
        { label: localeLabels.en, value: 'en' },
      ]}
    />
  );
}
