'use client';

import { type MouseEvent } from 'react';
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
  onClear: () => void;
};

export function EditorActions({ format, onChangeFormat, onClear }: EditorActionsProps) {
  const t = useTranslations('EDITOR');

  const changeFormat = (_event: MouseEvent<HTMLElement>, nextFormat: EditorFormat | null) => {
    if (nextFormat) {
      onChangeFormat(nextFormat);
    }
  };

  return (
    <header className={cx('header')}>
      <CodeOutlinedIcon fontSize="small" />
      <h2 className={cx('title')} id="editor-heading">
        {t('title')}
      </h2>
      <div className={cx('toolbar')}>
        <ToggleButtonGroup aria-label="Format" exclusive onChange={changeFormat} size="small" value={format}>
          <ToggleButton value="JSON">JSON</ToggleButton>
          <ToggleButton value="YAML">YAML</ToggleButton>
        </ToggleButtonGroup>

        <div className={cx('action-group')}>
          <Button size="small" startIcon={<ClearOutlinedIcon />} variant="outlined" onClick={onClear}>
            {t('clearButton')}
          </Button>
          <Button size="small" startIcon={<FolderOpenOutlinedIcon />} variant="outlined">
            {t('loadButton')}
          </Button>
        </div>
      </div>
    </header>
  );
}
