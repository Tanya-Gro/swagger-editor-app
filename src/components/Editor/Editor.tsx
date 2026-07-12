'use client';

import { useMemo } from 'react';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import CodeMirror from '@uiw/react-codemirror';

import { EditorActions } from './EditorActions/EditorActions';
import { ErrorList } from './ErrorList/ErrorList';
import { useEditorStore } from '@/store/useEditorStore';

import classNames from 'classnames/bind';
import styles from './Editor.module.css';
import Loading from '@/app/loading';

const cx = classNames.bind(styles);

export function Editor() {
  const format = useEditorStore((state) => state.format);
  const schema = useEditorStore((state) => state.schema);
  const setSchema = useEditorStore((state) => state.updateSchema);
  const isHydrated = useEditorStore((state) => state.isHydrated);

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

  return (
    <section className={cx('panel')} aria-labelledby="editor-heading">
      <EditorActions />
      <div className={cx('panel-body')}>
        <div className={cx('panel-code')}>
          {isHydrated ? (
            <CodeMirror value={schema} className={cx('editor')} extensions={extension} onChange={handleInputEditor} />
          ) : (
            <Loading />
          )}
        </div>
        <ErrorList />
      </div>
    </section>
  );
}
