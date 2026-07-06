'use client';

import { useEffect, useMemo, useState } from 'react';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import CodeMirror from '@uiw/react-codemirror';

import { EditorActions } from './EditorActions/EditorActions';
import { toast } from '@/utils/toast/toast';
import { detectFormat } from '@/utils/editor/detectFormat/detectFormat';
import { jsonToYaml, yamlToJson } from '@/utils/editor/convertFormat/convertFormat';
import { useTranslations } from 'next-intl';
import { type EditorFormat } from '@/types';

import classNames from 'classnames/bind';
import styles from './Editor.module.css';

const cx = classNames.bind(styles);
const AUTO_DETECT_DELAY = 500;

export function Editor() {
  const [format, setFormat] = useState<EditorFormat>('JSON');
  const [schema, setSchema] = useState<string>('');

  const t = useTranslations('EDITOR');

  useEffect(() => {
    if (schema.trim() === '' && format !== 'unknown') {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      const detectedFormat = detectFormat(schema);

      if (detectedFormat === format) {
        return;
      }

      setFormat(detectedFormat);

      if (detectedFormat === 'unknown') {
        toast.error(t('notifications.unsupportedFormat'));
      }
    }, AUTO_DETECT_DELAY);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [schema, format, t]);

  const extension = useMemo(() => {
    switch (format) {
      case 'JSON': {
        return [json()];
      }

      case 'YAML': {
        return [yaml()];
      }

      default: {
        return [];
      }
    }
  }, [format]);

  const handleInputEditor = (value: string): void => {
    setSchema(value);
  };

  const handleChangeFormat = (targetFormat: EditorFormat): void => {
    if (schema.trim() === '') {
      setFormat(targetFormat);
    } else if (format === 'unknown') {
      toast.warning(t('notifications.conversionDisabled'));
    } else {
      try {
        setSchema(targetFormat === 'JSON' ? yamlToJson(schema) : jsonToYaml(schema));
        setFormat(targetFormat);
      } catch (error) {
        toast.error(error instanceof Error ? t(error.message) : t('notifications.conversionError'));
      }
    }
  };

  const handleClear = (): void => {
    setSchema('');
  };

  return (
    <section className={cx('panel')} aria-labelledby="editor-heading">
      <EditorActions format={format} onChangeFormat={handleChangeFormat} onClear={handleClear} />
      <div className={cx('panel-body')}>
        <CodeMirror value={schema} className={cx('editor')} extensions={extension} onChange={handleInputEditor} />
      </div>
    </section>
  );
}
