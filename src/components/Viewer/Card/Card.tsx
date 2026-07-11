'use client';

import { Accordion, AccordionDetails, AccordionSummary, Chip, Divider, TextField } from '@mui/material';
import { ContentCopyOutlined, KeyboardArrowDown, PlayArrowOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import styles from './Card.module.css';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { type EndpointParameter } from '@/types';

const cx = classNames.bind(styles);

const response = {
  data: [
    {
      id: 1,
      name: 'John',
    },
  ],
  status: 'success',
};

type CardProps = {
  path: string;
  method: string;
  summary: string | null;
  parameters: EndpointParameter[];
};

export function Card({ path, method, summary, parameters }: CardProps) {
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
        <>
          <p className={cx('section-title')}>{t('response')}</p>
          <p className={cx('status')}>200 OK</p>
          <pre className={cx('response')}>
            <code>{JSON.stringify(response, null, 2)}</code>
          </pre>
        </>
      </AccordionDetails>
    </Accordion>
  );
}
