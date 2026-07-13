'use client';

import classNames from 'classnames/bind';
import styles from './Parameters.module.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, InputAdornment, TextField } from '@mui/material';
import { ContentCopyOutlined, PlayArrowOutlined } from '@mui/icons-material';

import type { JsonValue, SwaggerParameter } from '@/types';

const cx = classNames.bind(styles);

function stringifyRequestBody(body: JsonValue | null): string {
  if (body === null) {
    return '';
  }

  return JSON.stringify(body, null, 2);
}

type ParametersProps = {
  parameters: SwaggerParameter[];
  body: JsonValue | null;
};

export function Parameters({ parameters, body }: ParametersProps) {
  const [isFormOpen, setOpen] = useState<boolean>(false);

  const initialBodyValue = stringifyRequestBody(body);
  const [bodyValue, setBodyValue] = useState<string>(initialBodyValue);

  const t = useTranslations('VIEWER');

  const handleCancel = () => {
    setOpen(false);
    setBodyValue(initialBodyValue);
  };

  return (
    <section>
      <div className={cx('header')}>
        <h2 className={cx('title')}>{t('parameters')}</h2>

        {isFormOpen ? (
          <Button variant="outlined" size="small" onClick={handleCancel}>
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
          parameters.map((param) => {
            const inputId = `${param.in}-${param.name}`;

            return (
              <div key={inputId} className={cx('input')}>
                <label htmlFor={inputId} className={cx('label')}>
                  {param.name}
                  {param.required === true && <span aria-hidden={true}>*</span>}
                </label>

                <TextField
                  id={inputId}
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
          })
        ) : (
          <p className={cx('empty-message')}>{t('noParametersMessage')}</p>
        )}

        <h2 className={cx('title')}>{t('requestBody')}</h2>

        {body ? (
          <TextField
            name="requestBody"
            value={bodyValue}
            onChange={(event) => setBodyValue(event.target.value)}
            fullWidth
            multiline
            minRows={3}
            slotProps={{
              htmlInput: {
                readOnly: !isFormOpen,
                spellCheck: false,
              },
            }}
            sx={{
              '& textarea': {
                fontFamily: 'monospace',
                whiteSpace: 'pre',
                tabSize: 2,
              },
            }}
          />
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
