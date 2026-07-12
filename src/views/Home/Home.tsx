import { Editor } from '@/components/Editor/Editor';
import { serverClient } from '@/database/server-client';
import { getSchema } from '@/utils/editor/schemaService/schemaService';

import classNames from 'classnames/bind';
import styles from './Home.module.css';
import { EditorStoreInitializer } from '@/store/EditorStoreInitializer';
import type { EditorFormat } from '@/types';

const cx = classNames.bind(styles);

export async function Home() {
  const supabase = await serverClient();
  let initialSchema = '';
  let initialFormat: EditorFormat = 'JSON';

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const dbData = await getSchema(supabase, user.id);

    if (dbData) {
      initialSchema = dbData.schema;
      initialFormat = dbData.format;
    }
  }

  return (
    <div className={cx('main-layout')}>
      <EditorStoreInitializer initialSchema={initialSchema} initialFormat={initialFormat} />
      <Editor />
      <div className={cx('panel')}>Viewer placeholder</div>
    </div>
  );
}
