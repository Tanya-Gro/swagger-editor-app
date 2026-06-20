'use client';

import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Button } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/i18n/actions';
import type { Locale } from '@/i18n/config';

type LanguageSwitcherProperties = Readonly<{
  className?: string;
}>;

export function LanguageSwitcher({ className }: LanguageSwitcherProperties) {
  const locale = useLocale();
  const t = useTranslations('Header');
  const router = useRouter();
  const nextLocale: Locale = locale === 'ru' ? 'en' : 'ru';
  const label = nextLocale === 'ru' ? t('switchToRussian') : t('switchToEnglish');

  const changeLanguage = (): void => {
    setLocale(nextLocale)
      .then(() => {
        router.refresh();
      })
      .catch((error: unknown) => {
        console.error(error);
      });
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
