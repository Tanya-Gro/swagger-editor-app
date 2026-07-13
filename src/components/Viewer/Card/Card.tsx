'use client';

import { Accordion, AccordionDetails, AccordionSummary, Divider } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

import styles from './Card.module.css';
import classNames from 'classnames/bind';
import { type Endpoint } from '@/types';
import { Responses } from './Responses/Responses';
import { Parameters } from './Parameters/Parameters';
import { MethodChip } from '@/views/History/HistoryTable/HistoryTable';

const cx = classNames.bind(styles);

type CardProps = {
  endpoint: Endpoint;
};

export function Card({ endpoint }: CardProps) {
  const { pathname, method, summary, parameters, requestBodyExample, responses } = endpoint;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDown />}>
        <div className={cx('header')}>
          <MethodChip method={method.toUpperCase()} />
          <code className={cx('path')}>{pathname}</code>
        </div>
        <p className={cx('summary')}>{summary ?? ''}</p>
      </AccordionSummary>
      <Divider sx={{ margin: '16px 4px' }} />
      <AccordionDetails>
        <Parameters parameters={parameters} body={requestBodyExample} />
        <Responses responses={responses} />
      </AccordionDetails>
    </Accordion>
  );
}
