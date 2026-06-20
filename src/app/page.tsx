'use client';

import { useTranslations } from 'next-intl';

export default function MainRoute() {
  const t = useTranslations('MainPage');

  return <h1>{t('title')}</h1>;
}
