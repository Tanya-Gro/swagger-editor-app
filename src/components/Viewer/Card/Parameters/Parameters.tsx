'use client';

import classNames from 'classnames/bind';
import styles from './Parameters.module.css';
import { useState, type SyntheticEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button, InputAdornment, TextField } from '@mui/material';
import { ContentCopyOutlined, PlayArrowOutlined } from '@mui/icons-material';

import type { HttpMethod, JsonValue, SwaggerParameter } from '@/types';
import { getEndpointKey, useViewerStore, type ProxyResponseData } from '@/store/useViewerStore';
import { saveRequestToHistoryAction } from '@/app/actions/historyAction';

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
  method: HttpMethod;
  pathname: string;
};

type BuildRequestResult = {
  url: string;
  headers: Record<string, string>;
};

const HTTP_BAD_REQUEST_STATUS = 400;

function isProxyResponseData(data: unknown): data is ProxyResponseData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const hasStatus = 'status' in data && typeof data.status === 'number';
  const hasStatusText = 'statusText' in data && typeof data.statusText === 'string';
  const hasHeaders = 'headers' in data && typeof data.headers === 'object';
  const hasBody = 'body' in data && typeof data.body === 'string';
  const hasMetrics = 'metrics' in data && typeof data.metrics === 'object';

  return hasStatus && hasStatusText && hasHeaders && hasBody && hasMetrics;
}

export function Parameters({ parameters, body, method, pathname }: ParametersProps) {
  const key = getEndpointKey(method, pathname);
  const isFormOpen = useViewerStore((state) => state.openForms[key] ?? false);
  const setFormOpen = useViewerStore((state) => state.setFormOpen);
  const setExecuteResult = useViewerStore((state) => state.setExecuteResult);
  const resetEndpoint = useViewerStore((state) => state.resetEndpoint);
  const t = useTranslations('VIEWER');

  const initialBodyValue = stringifyRequestBody(body);
  const [bodyValue, setBodyValue] = useState<string>(initialBodyValue);

  const handleCancel = (): void => {
    setBodyValue(initialBodyValue);
    resetEndpoint(method, pathname);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formFields: Record<string, string> = {};
    formData.forEach((value, keyOrName) => {
      if (typeof value === 'string') {
        formFields[keyOrName] = value;
      }
    });

    const baseUrl = globalThis.location.origin;

    const { url, headers } = buildRequestData(baseUrl, pathname, parameters, formFields);

    const targetBody = body ? bodyValue : null;

    const proxyPayload = {
      targetUrl: url,
      method: method,
      headers: headers,
      body: targetBody,
    };

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proxyPayload),
      });

      const result: unknown = await response.json();

      if (!isProxyResponseData(result)) {
        console.error('Invalid response structure from proxy');
        return;
      }

      setExecuteResult(method, pathname, result);

      const requestSize = targetBody ? new Blob([targetBody]).size : 0;
      const responseSize = result.body ? new Blob([result.body]).size : 0;

      await saveRequestToHistoryAction({
        method,
        targetUrl: url,
        status: result.status,
        durationMs: result.metrics.durationMs,
        requestSize,
        responseSize,
        error: result.status >= HTTP_BAD_REQUEST_STATUS ? result.statusText || 'Bad Request' : null,
      });
    } catch (error) {
      console.error('Execution or history saving failed:', error);
    }
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
          <Button variant="contained" size="small" onClick={() => setFormOpen(method, pathname, true)}>
            {t('tryAction')}
          </Button>
        )}
      </div>

      <form
        className={cx('form')}
        onSubmit={(event: SyntheticEvent<HTMLFormElement>): void => {
          void handleSubmit(event);
        }}
      >
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
                  name={inputId}
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
              {t('curlAction')}
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}

export function buildRequestData(
  baseUrl: string,
  pathnameTemplate: string,
  parameters: readonly SwaggerParameter[],
  formData: Record<string, string>,
): BuildRequestResult {
  let finalPathname = pathnameTemplate;
  const queryParams = new URLSearchParams();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  parameters.forEach((param) => {
    const inputKey = `${param.in}-${param.name}`;
    const value = formData[inputKey];

    if (!value) {
      return;
    }

    switch (param.in) {
      case 'path': {
        finalPathname = finalPathname
          .replace(`{${param.name}}`, encodeURIComponent(value))
          .replace(`:${param.name}`, encodeURIComponent(value));

        break;
      }
      case 'query': {
        queryParams.append(param.name, value);

        break;
      }
      case 'header': {
        headers[param.name] = value;

        break;
      }
      // No default
    }
  });

  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const queryString = queryParams.toString();
  const finalUrl = `${cleanBase}${finalPathname}${queryString ? `?${queryString}` : ''}`;

  return {
    url: finalUrl,
    headers,
  };
}
