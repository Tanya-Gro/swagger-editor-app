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
  const { pathname, method, summary, parameters, responses } = endpoint;
  const t = useTranslations('ENDPOINT_CARD');

  return (
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDown />}>
        <div className={cx('header')}>
          <Chip label={method} />
          <code className={cx('path')}>{pathname}</code>
        </div>
        <p className={cx('summary')}>{summary ?? ''}</p>
      </AccordionSummary>
      <Divider sx={{ margin: '16px 4px' }} />
      <AccordionDetails>
        <form className={cx('form')}>
          {parameters.length > 0 && (
            <>
              <h2 className={cx('section-title')}>{t('parameters')}</h2>
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
                  />
                );
              })}
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
          {responses && (
            <>
              <h2 className={cx('section-title')}>{t('response')}</h2>
              <ul className={cx('list')}>
                {Object.entries(responses).map(([status, response]) => {
                  return (
                    <li key={status} className={cx('list-item')}>
                      <pre className={cx('response')}>
                        <code>{JSON.stringify({ status, response }, null, 2)}</code>
                      </pre>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      </AccordionDetails>
    </Accordion>
  );
}
