'use server';

import { serverClient } from '@/database/server-client';

type SaveHistoryPayload = {
  method: string;
  targetUrl: string;
  status: number;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  error: string | null;
};

type SaveHistoryResult = { success: true } | { success: false; error: string };

export async function saveRequestToHistoryAction(payload: SaveHistoryPayload): Promise<SaveHistoryResult> {
  try {
    const supabase = await serverClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: schemaData, error: schemaError } = await supabase
      .from('openapi_schemas')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (schemaError) {
      return { success: false, error: `Failed to fetch schema metadata: ${schemaError.message}` };
    }

    if (!schemaData) {
      return { success: false, error: 'Active schema not found for this user' };
    }

    const { error: insertError } = await supabase.from('request_logs').insert({
      schema_id: schemaData.id,
      method: payload.method.toUpperCase(),
      url: payload.targetUrl,
      status: payload.status,
      duration: payload.durationMs,
      owner_id: user.id,
      request_size: payload.requestSize,
      response_size: payload.responseSize,
      error: payload.error,
      timestamp: new Date().toISOString(),
    });

    if (insertError) {
      return { success: false, error: `Database insert failed: ${insertError.message}` };
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    return { success: false, error: errorMessage };
  }
}
