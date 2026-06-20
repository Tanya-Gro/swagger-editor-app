'use client';

import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useAppLocale } from '@/i18n/AppIntlProvider';
import type { Locale } from '@/i18n/config';

type LanguageSwitcherProperties = Readonly<{
  className?: string;
}>;

export function LanguageSwitcher({ className }: LanguageSwitcherProperties) {
  const { locale, setLocale } = useAppLocale();
  const t = useTranslations('Header');
  const nextLocale: Locale = locale === 'ru' ? 'en' : 'ru';
  const label = nextLocale === 'ru' ? t('switchToRussian') : t('switchToEnglish');

  const changeLanguage = (): void => {
    setLocale(nextLocale);
  };

  return (
    <Button
      aria-label={label}
      className={className}
      onClick={changeLanguage}
      startIcon={<PublicOutlinedIcon />}
      variant="text"
    >
      {nextLocale.toUpperCase()}
    </Button>
  );
}
