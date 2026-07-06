'use client';

import { useRef, type ChangeEvent, type MouseEvent } from 'react';
import { type EditorFormat } from '@/types';

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslations } from 'next-intl';

import styles from './EditorActions.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type EditorActionsProps = {
  format: EditorFormat;
  onChangeFormat: (format: EditorFormat) => void;
  onChangeSchema: (text: string) => void;
};

const BITES_IN_KB = 1024;
const MAX_FILE_SIZE = 2 * BITES_IN_KB * BITES_IN_KB;

export function EditorActions({ format, onChangeFormat, onChangeSchema }: EditorActionsProps) {
  const t = useTranslations('EDITOR');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeFormat = (_event: MouseEvent<HTMLElement>, nextFormat: EditorFormat | null) => {
    if (nextFormat) {
      onChangeFormat(nextFormat);
    }
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const resetInput = () => (event.target.value = '');

    if (file.size > MAX_FILE_SIZE) {
      console.info("добавить toast.error(`${file.name} t('fileTooLarge')`);");
      resetInput();
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isJson = file.type === 'application/json' || fileExtension === 'json';
    const isYaml =
      file.type === 'application/x-yaml' ||
      file.type === 'text/yaml' ||
      fileExtension === 'yaml' ||
      fileExtension === 'yml';

    if (!isJson && !isYaml) {
      console.info("добавить toast.error(`${file.name} t('invalidFileType')`);");
      resetInput();
      return;
    }

    void (async () => {
      try {
        const text = await file.text();
        onChangeSchema(text);

        const detectedFormat: EditorFormat = isJson ? 'JSON' : 'YAML';
        if (format !== detectedFormat) {
          onChangeFormat(detectedFormat);
        }

        console.info("добавить toast.success(`${file.name} t('loadingSuccess')`);");
      } catch {
        console.info("добавить toast.error(t('loadingError'));");
      } finally {
        resetInput();
      }
    })();
  };

  return (
    <header className={cx('header')}>
      <CodeOutlinedIcon fontSize="small" />
      <h2 className={cx('title')} id="editor-heading">
        {t('title')}
      </h2>
      <div className={cx('toolbar')}>
        <ToggleButtonGroup aria-label="Format" exclusive onChange={handleChangeFormat} size="small" value={format}>
          <ToggleButton value="JSON">JSON</ToggleButton>
          <ToggleButton value="YAML">YAML</ToggleButton>
        </ToggleButtonGroup>

        <div className={cx('action-group')}>
          <Button size="small" startIcon={<ClearOutlinedIcon />} variant="outlined" onClick={() => onChangeSchema('')}>
            {t('clearButton')}
          </Button>
          <Button size="small" startIcon={<FolderOpenOutlinedIcon />} variant="outlined" onClick={handleLoadClick}>
            {t('loadButton')}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,.yaml,.yml"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </header>
  );
}
