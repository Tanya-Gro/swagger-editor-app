'use client';

import { useEffect, useMemo, useState } from 'react';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { EditorActions } from './EditorActions/EditorActions';
import CodeMirror from '@uiw/react-codemirror';
import { detectFormat } from '@/utils/editor/detectFormat';
import { type EditorFormat } from '@/types';

import classNames from 'classnames/bind';
import styles from './Editor.module.css';

const cx = classNames.bind(styles);

const AUTO_DETECT_DELAY = 500;

export function Editor() {
  const [format, setFormat] = useState<EditorFormat>('JSON');
  const [schema, setSchema] = useState<string>('');

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setFormat(detectFormat(schema));
      console.info('добавить info тост если формат unknown');
    }, AUTO_DETECT_DELAY);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [schema]);

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

  const handleClear = (): void => {
    setSchema('');
  };

  return (
    <section className={cx('panel')} aria-labelledby="editor-heading">
      <EditorActions format={format} onChangeFormat={setFormat} onClear={handleClear} />
      <div className={cx('panel-body')}>
        <CodeMirror value={schema} className={cx('editor')} extensions={extension} onChange={handleInputEditor} />
      </div>
    </section>
  );
}
