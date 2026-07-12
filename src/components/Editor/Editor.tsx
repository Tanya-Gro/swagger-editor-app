'use client';

import { useEffect, useMemo, useRef } from 'react';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import CodeMirror from '@uiw/react-codemirror';

import { EditorActions } from './EditorActions/EditorActions';
import { ErrorList } from './ErrorList/ErrorList';
import { useEditorStore } from '@/store/useEditorStore';

import classNames from 'classnames/bind';
import styles from './Editor.module.css';
import Loading from '@/app/loading';
import { toast } from '@/utils/toast/toast';
import { useTranslations } from 'next-intl';

const cx = classNames.bind(styles);

type EditorProps = {
  fetchError?: string | undefined;
};

export function Editor({ fetchError }: EditorProps) {
  const t = useTranslations('EDITOR');

  const format = useEditorStore((state) => state.format);
  const schema = useEditorStore((state) => state.schema);
  const setSchema = useEditorStore((state) => state.updateSchema);
  const isHydrated = useEditorStore((state) => state.isHydrated);
  const isValidating = useEditorStore((state) => state.isValidating);
  const isValid = useEditorStore((state) => state.isValid);
  const validSchema = useEditorStore((state) => state.validSchema);
  const saveStatus = useEditorStore((state) => state.saveStatus);

  const prevIsValidRef = useRef(isValid);

  useEffect(() => {
    if (fetchError) {
      toast.error(t(fetchError));
    }
  }, [fetchError, t]);

  useEffect(() => {
    if (isValid && !isValidating && validSchema && !prevIsValidRef.current) {
      toast.success(t('notifications.validationSuccess'));
    }

    prevIsValidRef.current = isValid;
  }, [validSchema, isValid, isValidating, t]);

  useEffect(() => {
    if (saveStatus === 'success') {
      toast.success(t('notifications.savedSuccess'));
    }

    if (saveStatus === 'error') {
      toast.error(t('notifications.failedToSave'));
    }
  }, [saveStatus, t]);

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
