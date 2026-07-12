import { useEffect } from 'react';
import { toast } from '@/utils/toast/toast';
import Loading from '@/app/loading';
import { useTranslations } from 'next-intl';
import { useEditorStore } from '@/store/useEditorStore';

import classNames from 'classnames/bind';
import styles from './ErrorList.module.css';

const cx = classNames.bind(styles);

export const ErrorList = () => {
  const t = useTranslations('EDITOR');
  const isValidating = useEditorStore((state) => state.isValidating);
  const isValid = useEditorStore((state) => state.isValid);
  const isHydrated = useEditorStore((state) => state.isHydrated);
  const validSchema = useEditorStore((state) => state.validSchema);
  const errors = useEditorStore((state) => state.errors);

  useEffect(() => {
    if (isValid && !isValidating && validSchema) {
      toast.success(t('notifications.validationSuccess'));
    }
  }, [validSchema, isValid, isValidating, t]);

  if (!isHydrated || isValid) {
    return null;
  }

  if (isValidating) {
    return <Loading />;
  }

  return (
    <div className={cx('error-panel')} data-testid="error-list" aria-live="polite">
      <h3 className={cx('title')}>
        {t('errorList.title')} ({errors.length}):
      </h3>
      <ul className={cx('list')}>
        {errors.map((err, index) => {
          const isTranslationKey = err.message.startsWith('notifications.');
          const translatedMessage = isTranslationKey ? t(err.message) : err.message;
          const key = `${err.path}-${err.message}-${String(index)}`;
          return (
            <li key={key} className={cx('error')}>
              {err.path && <strong className={cx('error-path')}>{err.path}: </strong>}
              {translatedMessage}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
