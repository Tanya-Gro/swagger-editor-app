import { load, dump } from 'js-yaml';
import { validateSchema } from '@/utils/editor/validateSchema/validateSchema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { EditorFormat, SchemaSaveResult } from '@/types';

type SchemaRow = {
  content: unknown;
  original_format: unknown;
};

export async function getSchema(
  supabase: Pick<SupabaseClient, 'from'>,
  userId: string,
): Promise<{ schema: string; format: EditorFormat } | null> {
  const { data, error } = await supabase
    .from('openapi_schemas')
    .select('content, original_format')
    .eq('owner_id', userId)
    .single();

  if (error) {
    return null;
  }

  if (!isSchemaRow(data) || !data.content) {
    return null;
  }

  const rawFormat = typeof data.original_format === 'string' ? data.original_format.toUpperCase() : '';

  const userFormat: EditorFormat = isEditorFormat(rawFormat) ? rawFormat : 'JSON';

  const textString = userFormat === 'YAML' ? dump(data.content) : JSON.stringify(data.content, null, 2);

  return {
    schema: textString,
    format: userFormat,
  };
}

export async function saveSchema(
  supabase: Pick<SupabaseClient, 'from'>,
  userId: string,
  content: string,
  format: EditorFormat,
): Promise<SchemaSaveResult> {
  const validationErrors = await validateSchema(content, format);

  if (validationErrors.length > 0) {
    return { success: false, error: 'Server-side validation failed' };
  }

  try {
    const parsedJson: unknown = format === 'JSON' ? JSON.parse(content) : load(content);

    if (typeof parsedJson !== 'object' || parsedJson === null) {
      return { success: false, error: 'Invalid object structure' };
    }

    const { error } = await supabase.from('openapi_schemas').upsert(
      {
        owner_id: userId,
        content: parsedJson,
        original_format: format.toLowerCase(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Parsing failed' };
  }
}

function isEditorFormat(value: unknown): value is EditorFormat {
  return value === 'JSON' || value === 'YAML' || value === 'unknown';
}

function isSchemaRow(data: unknown): data is SchemaRow {
  return typeof data === 'object' && data !== null && 'content' in data && 'original_format' in data;
}
