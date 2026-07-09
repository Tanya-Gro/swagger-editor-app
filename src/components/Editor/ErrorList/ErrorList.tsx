import { useTranslations } from 'next-intl';
import type { ValidationError } from '@/store/useEditorStore';

import classNames from 'classnames/bind';
import styles from './ErrorList.module.css';

const cx = classNames.bind(styles);

type ErrorListProps = {
  errors: ValidationError[];
};

export const ErrorList = ({ errors }: ErrorListProps) => {
  const t = useTranslations('EDITOR');

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={cx('error-panel')} data-testid="error-list">
      <h3 className={cx('title')}>
        {t('errorList.title')} ({errors.length}):
      </h3>
      <ul className={cx('list')}>
        {errors.map((err, index) => {
          const isTranslationKey = err.message.startsWith('notifications.');
          const translatedMessage = isTranslationKey ? t(err.message) : err.message;
          return (
            <li key={index} className={cx('error')}>
              {err.path && <strong className={cx('error-path')}>{err.path}: </strong>}
              {translatedMessage}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
