'use client';

import { Accordion, AccordionDetails, AccordionSummary, Chip, Divider, TextField, Typography } from '@mui/material';
import { ContentCopyOutlined, KeyboardArrowDown, PlayArrowOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import styles from './Card.module.css';
import classNames from 'classnames/bind';

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

export function Card() {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDown />}>
        <div className={cx()}>
          <Chip label="GET" />
          <Typography component="code">/users</Typography>
        </div>
        <p>Get a list of all users</p>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <TextField name="Parameters" placeholder="id" />
        {/* использовать переводы тут*/}
        <Button variant="contained" startIcon={<PlayArrowOutlined />}>
          Execute
        </Button>
        <Button variant="outlined" startIcon={<ContentCopyOutlined />}>
          cURL
        </Button>
        <div></div>
        <p>Response</p>
        <p>200 OK</p>
        <pre>
          <code>{JSON.stringify(response, null, 2)}</code>
        </pre>
      </AccordionDetails>
    </Accordion>
  );
}
