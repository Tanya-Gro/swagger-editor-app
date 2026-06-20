'use client';

import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { Button } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './EditorViewer.module.css';

const cx = classNames.bind(styles);

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

        <div className={cx('panel-body', 'editor-placeholder')}>
          <div>Editor placeholder</div>
        </div>
      </section>

      <section className={cx('panel')} aria-labelledby="viewer-heading">
        <header className={cx('panel-header', 'viewer-header')}>
          <h2 className={cx('panel-title')} id="viewer-heading">
            Swagger Viewer
          </h2>
          <p className={cx('panel-subtitle')}>Sample API v1.0.0</p>
        </header>

        <div className={cx('panel-body', 'viewer-placeholder')}>
          <div>Viewer placeholder</div>
        </div>
      </section>
    </div>
  );
}
