'use client';

import { useState } from 'react';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { EditorActions } from './EditorActions/EditorActions';
import CodeMirror from '@uiw/react-codemirror';

import classNames from 'classnames/bind';
import styles from './Editor.module.css';

import { type EditorFormat } from '@/types';

const cx = classNames.bind(styles);

export function Editor() {
  const [format, setFormat] = useState<EditorFormat>('JSON');
  const [schema, setSchema] = useState<string>('');
  const extension = format === 'JSON' ? [json()] : [yaml()];

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
