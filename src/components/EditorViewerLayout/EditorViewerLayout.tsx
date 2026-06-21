import classNames from 'classnames/bind';
import type { ReactNode } from 'react';
import styles from './EditorViewerLayout.module.css';

const cx = classNames.bind(styles);

type EditorViewerLayoutProps = Readonly<{
  editor: ReactNode;
  viewer: ReactNode;
}>;

export function EditorViewerLayout({ editor, viewer }: EditorViewerLayoutProps) {
  return (
    <div className={cx('layout')}>
      <div className={cx('panel', 'editor-panel')}>{editor}</div>
      <div className={cx('panel')}>{viewer}</div>
    </div>
  );
}
