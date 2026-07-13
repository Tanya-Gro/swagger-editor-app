'use client';

import classNames from 'classnames/bind';
import styles from './Parameters.module.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { ContentCopyOutlined, PlayArrowOutlined } from '@mui/icons-material';
import type { EndpointParameter } from '@/types';

const cx = classNames.bind(styles);

type ParametersProps = {
  parameters: EndpointParameter[];
};

export function Parameters({ parameters }: ParametersProps) {
  const [isFormOpen, setOpen] = useState<boolean>(false);
  const t = useTranslations('VIEWER');

  return (
    <section>
      <div className={cx('header')}>
        <h2 className={cx('title')}>{t('parameters')}</h2>
        {isFormOpen ? (
          <Button variant="outlined" size="small" onClick={() => setOpen(false)}>
            {t('cancelAction')}
          </Button>
        ) : (
          <Button variant="contained" size="small" onClick={() => setOpen(true)}>
            {t('tryAction')}
          </Button>
        )}
      </div>
      <form className={cx('form')}>
        {parameters.length > 0 && (
          <>
            {parameters.map((param) => {
              return (
                <TextField
                  key={`${param.in}-${param.name}`}
                  fullWidth
                  name={param.name}
                  label={param.name}
                  helperText={param.description ?? ''}
                  required={param.required}
                  type="string"
                  multiline={param.name === 'body'}
                  minRows={3}
                  disabled={!isFormOpen}
                />
              );
            })}
          </>
        )}
        {isFormOpen && (
          <div className={cx('actions')}>
            <Button type="submit" variant="contained" startIcon={<PlayArrowOutlined />}>
              {t('executeAction')}
            </Button>
            <Button type="button" variant="outlined" startIcon={<ContentCopyOutlined />}>
              cURL
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}
