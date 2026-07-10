import { Editor } from '@/components/Editor/Editor';
import { Viewer } from '@/components/Viewer/Viewer';

import classNames from 'classnames/bind';
import styles from './Home.module.css';

const cx = classNames.bind(styles);

export function Home() {
  return (
    <div className={cx('main-layout')}>
      <Editor />
      <Viewer />
    </div>
  );
}
