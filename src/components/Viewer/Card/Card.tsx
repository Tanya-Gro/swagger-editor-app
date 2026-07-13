'use client';

import { Accordion, AccordionDetails, AccordionSummary, Chip, Divider } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

import styles from './Card.module.css';
import classNames from 'classnames/bind';
import { type Endpoint } from '@/types';
import { Responses } from './Responses/Responses';
import { Parameters } from './Parameters/Parameters';

const cx = classNames.bind(styles);

type CardProps = {
  endpoint: Endpoint;
};

export function Card({ endpoint }: CardProps) {
  const { pathname, method, summary, parameters, responses } = endpoint;

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
        <Parameters parameters={parameters} />
        <Responses responses={responses} />
      </AccordionDetails>
    </Accordion>
  );
}
