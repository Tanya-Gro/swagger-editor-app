'use client';

import { Accordion, AccordionDetails, AccordionSummary, Chip, Divider, TextField } from '@mui/material';
import { ContentCopyOutlined, KeyboardArrowDown, PlayArrowOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import styles from './Card.module.css';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { type Endpoint } from '@/types';

const cx = classNames.bind(styles);

type CardProps = {
  endpoint: Endpoint;
};

export function Card({ endpoint }: CardProps) {
  const { path, method, summary, parameters, responses } = endpoint;
  const t = useTranslations('ENDPOINT_CARD');

  return (
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDown />}>
        <div className={cx('header')}>
          <Chip label={method} />
          <code className={cx('path')}>{path}</code>
        </div>
        <p className={cx('summary')}>{summary ?? ''}</p>
      </AccordionSummary>
      <Divider sx={{ margin: '16px 4px' }} />
      <AccordionDetails>
        <form className={cx('form')}>
          {parameters.length > 0 && (
            <>
              <p className={cx('section-title')}>{t('parameters')}</p>
              {parameters.map((param) => (
                <TextField
                  fullWidth
                  key={`${param.in}-${param.name}`}
                  name={param.name}
                  label={param.name}
                  helperText={param.description ?? ''}
                  required={param.required}
                  type="string"
                />
              ))}
            </>
          )}
          <div className={cx('actions')}>
            <Button type="submit" variant="contained" startIcon={<PlayArrowOutlined />}>
              {t('executeAction')}
            </Button>
            <Button type="button" variant="outlined" startIcon={<ContentCopyOutlined />}>
              cURL
            </Button>
          </div>
        </form>
        <section className={cx('responses')}>
          <ul className={cx('responses-list')}>
            {responses.map((res) => {
              return (
                <li key={res.status} className={cx('response')}>
                  <p className={cx('section-title')}>{t('response')}</p>
                  <p className={cx('status')}>{`${res.status}, ${res.description ?? ''}`}</p>
                  {res.example !== null && (
                    <pre>
                      <code>{JSON.stringify(res.example, null, 2)}</code>
                    </pre>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </AccordionDetails>
    </Accordion>
  );
}
