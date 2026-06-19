'use client';

import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, Paper, TextField } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './EditorViewer.module.css';

const cx = classNames.bind(styles);

const swaggerExample = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: API для демонстрации
paths:
  /users:
    get:
      summary: Получить список пользователей
      responses:
        '200':
          description: Успешный ответ
  /users/{id}:
    get:
      summary: Получить пользователя по ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer`;

type Endpoint = {
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  request?: 'id' | 'body';
  response?: string;
  status?: string;
};

const endpoints: Endpoint[] = [
  {
    description: 'Получить список пользователей',
    method: 'GET',
    path: '/users',
    response: '{\n  "data": [...],\n  "status": "success"\n}',
    status: '200 OK',
  },
  {
    description: 'Получить пользователя по ID',
    method: 'GET',
    path: '/users/{id}',
    request: 'id',
    response: '{\n  "data": {\n    "id": 1,\n    "name": "John Doe"\n  },\n  "status": "success"\n}',
    status: '200 OK',
  },
  {
    description: 'Создать пользователя',
    method: 'POST',
    path: '/users',
    request: 'body',
    response: [
      '{',
      '  "data": {',
      '    "id": 2,',
      '    "name": "John Doe",',
      '    "email": "john@example.com"',
      '  },',
      '  "status": "success"',
      '}',
    ].join('\n'),
    status: '201 Created',
  },
  { description: 'Обновить пользователя', method: 'PUT', path: '/users/{id}' },
  { description: 'Удалить пользователя', method: 'DELETE', path: '/users/{id}' },
];

export function EditorViewer() {
  return (
    <div className={cx('split-view')}>
      <section className={cx('panel', 'editor-panel')} aria-labelledby="editor-heading">
        <header className={cx('panel-header', 'editor-header')}>
          <h1 className={cx('panel-title')} id="editor-heading">
            <CodeOutlinedIcon fontSize="small" />
            Swagger Editor
          </h1>
          <div className={cx('button-group')}>
            <Button size="small" variant="outlined">
              JSON
            </Button>
            <Button size="small" variant="outlined">
              YAML
            </Button>
          </div>
        </header>

        <div className={cx('panel-body')}>
          <Paper className={cx('code-preview')} component="pre" elevation={0}>
            {swaggerExample}
          </Paper>
        </div>
      </section>

      <section className={cx('panel')} aria-labelledby="viewer-heading">
        <header className={cx('panel-header', 'viewer-header')}>
          <h2 className={cx('panel-title')} id="viewer-heading">
            Swagger Viewer
          </h2>
          <p className={cx('panel-subtitle')}>Sample API v1.0.0</p>
        </header>

        <div className={cx('panel-body', 'endpoint-list')}>
          {endpoints.map((endpoint) => (
            <EndpointCard endpoint={endpoint} key={`${endpoint.method}-${endpoint.path}`} />
          ))}
        </div>
      </section>
    </div>
  );
}

function EndpointCard({ endpoint }: Readonly<{ endpoint: Endpoint }>) {
  const hasDetails = Boolean(endpoint.response);

  return (
    <Accordion
      className={cx('endpoint-card')}
      disableGutters
      elevation={0}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary
        aria-controls={`${endpoint.method}-${endpoint.path}-content`}
        className={cx('endpoint-summary')}
        expandIcon={hasDetails ? <ExpandMoreOutlinedIcon fontSize="small" /> : null}
        id={`${endpoint.method}-${endpoint.path}-header`}
      >
        <div className={cx('endpoint-heading')}>
          <div className={cx('endpoint-row')}>
            <Chip
              className={cx('method', `method-${endpoint.method.toLowerCase()}`)}
              label={endpoint.method}
              size="small"
            />
            <code className={cx('endpoint-path')}>{endpoint.path}</code>
          </div>
          <p className={cx('endpoint-description')}>{endpoint.description}</p>
        </div>
      </AccordionSummary>

      {hasDetails && (
        <AccordionDetails className={cx('endpoint-details')} id={`${endpoint.method}-${endpoint.path}-content`}>
          <div className={cx('stack')}>
            {endpoint.request === 'id' && <TextField fullWidth label="Параметры" placeholder="id" size="small" />}
            {endpoint.request === 'body' && (
              <TextField
                fullWidth
                label="Request Body"
                minRows={4}
                multiline
                placeholder={'{"name": "John Doe", "email": "john@example.com"}'}
              />
            )}
            <div className={cx('button-group')}>
              <Button color="success" startIcon={<PlayArrowOutlinedIcon />} variant="contained">
                Выполнить
              </Button>
              <Button startIcon={<ContentCopyOutlinedIcon />} variant="outlined">
                cURL
              </Button>
            </div>
            <Paper className={cx('response-box')} elevation={0}>
              <span className={cx('response-title')}>Response</span>
              <span className={cx('response-status')}>{endpoint.status}</span>
              <pre className={cx('response-code')}>{endpoint.response}</pre>
            </Paper>
          </div>
        </AccordionDetails>
      )}
    </Accordion>
  );
}
