'use client';

import classNames from 'classnames/bind';
import styles from './Parameters.module.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';
import { ContentCopyOutlined, PlayArrowOutlined } from '@mui/icons-material';
import type { RequestBody, SwaggerParameter } from '@/types';

const cx = classNames.bind(styles);

type ParametersProps = {
  parameters: SwaggerParameter[];
  body: RequestBody | null;
};

export function Parameters({ parameters, body }: ParametersProps) {
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
        {parameters.length > 0 ? (
          <>
            {parameters.map((param) => {
              return (
                <div key={`${param.in}-${param.name}`} className={cx('input')}>
                  <label htmlFor={param.name} className={cx('label')}>
                    {param.name}
                    {param.required && <span aria-hidden={true}>*</span>}
                  </label>
                  <TextField
                    id={param.name}
                    fullWidth
                    name={param.name}
                    helperText={param.description ?? ''}
                    required={param.required}
                    disabled={!isFormOpen}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <span>{param.in}</span>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
              );
            })}
          </>
        ) : (
          <p className={cx('empty-message')}>{t('noParametersMessage')}</p>
        )}
        <h2 className={cx('title')}>{t('requestBody')}</h2>
        {body ? (
          <TextField fullWidth multiline minRows={3} disabled={!isFormOpen} />
        ) : (
          <p className={cx('empty-message')}>{t('noBodyMessage')}</p>
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
