import { getTranslations } from 'next-intl/server';

export default async function MainRoute() {
  const t = await getTranslations('MAIN_PAGE');

  return <h1>{t('title')}</h1>;
}
