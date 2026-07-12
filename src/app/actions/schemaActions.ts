'use server';

import { serverClient } from '@/database/server-client';
import { saveSchema } from '@/utils/editor/schemaService/schemaService';
import type { EditorFormat, SchemaSaveResult } from '@/types';

export async function updateSchemaAction(content: string, format: EditorFormat): Promise<SchemaSaveResult> {
  const supabase = await serverClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  return await saveSchema(supabase, user.id, content, format);
}
