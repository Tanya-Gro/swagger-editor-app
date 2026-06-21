'use client';

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import classNames from 'classnames/bind';
import { type MouseEvent, useState } from 'react';
import styles from './Editor.module.css';

const cx = classNames.bind(styles);

type EditorFormat = 'JSON' | 'YAML';

export function Editor() {
  const [format, setFormat] = useState<EditorFormat>('YAML');

  const changeFormat = (_event: MouseEvent<HTMLElement>, nextFormat: EditorFormat | null) => {
    if (nextFormat) {
      setFormat(nextFormat);
    }
  };

  return (
    <section className={cx('editor')} aria-labelledby="editor-heading">
      <header className={cx('header')}>
        <h1 className={cx('title')} id="editor-heading">
          Swagger Editor
        </h1>
        <div className={cx('toolbar')}>
          <ToggleButtonGroup
            aria-label="Формат спецификации"
            exclusive
            onChange={changeFormat}
            size="small"
            value={format}
          >
            <ToggleButton value="JSON">JSON</ToggleButton>
            <ToggleButton value="YAML">YAML</ToggleButton>
          </ToggleButtonGroup>

          <div className={cx('action-group')}>
            <Button color="success" size="small" startIcon={<PlayArrowOutlinedIcon />} variant="contained">
              Run
            </Button>
            <Button size="small" startIcon={<ClearOutlinedIcon />} variant="outlined">
              Clear
            </Button>
            <Button size="small" startIcon={<SaveOutlinedIcon />} variant="outlined">
              Save
            </Button>
            <Button size="small" startIcon={<FolderOpenOutlinedIcon />} variant="outlined">
              Load
            </Button>
          </div>
        </div>
      </header>

      <div className={cx('placeholder')}>
        <div>Editor placeholder</div>
      </div>
    </section>
  );
}
