'use client';

import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { FormControl, InputAdornment, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/i18n/actions';
import { isLocale } from '@/i18n/config';
import { toast } from '@/utils/toast/toast';

type LanguageSwitcherProperties = Readonly<{
  className?: string;
}>;

export function LanguageSwitcher({ className }: LanguageSwitcherProperties) {
  const locale = useLocale();
  const t = useTranslations('HEADER');
  const router = useRouter();

  const changeLanguage = (event: SelectChangeEvent): void => {
    const selectedLocale = event.target.value;

    if (!isLocale(selectedLocale) || selectedLocale === locale) {
      return;
    }

    setLocale(selectedLocale)
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        toast.error(t('languageSwitchError'));
      });
  };

  return (
    <FormControl className={className} size="small">
      <Select
        inputProps={{ 'aria-label': t('languageLabel') }}
        onChange={changeLanguage}
        startAdornment={
          <InputAdornment position="start">
            <PublicOutlinedIcon fontSize="small" />
          </InputAdornment>
        }
        value={locale}
      >
        <MenuItem value="en">{t('english')}</MenuItem>
        <MenuItem value="ru">{t('russian')}</MenuItem>
      </Select>
    </FormControl>
  );
}
