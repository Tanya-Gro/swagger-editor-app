import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { updateSchemaAction } from './schemaActions';
import { serverClient } from '@/database/server-client';
import { saveSchema } from '@/utils/editor/schemaService/schemaService';

type ResolvedSupabaseClient = Awaited<ReturnType<typeof serverClient>>;

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
});

vi.mock('@/database/server-client', () => ({
  serverClient: vi.fn(),
}));

vi.mock('@/utils/editor/schemaService/schemaService', () => ({
  saveSchema: vi.fn(),
}));

describe('updateSchemaAction Server Action', () => {
  const mockGetUser = vi.fn();
  const mockFrom = vi.fn();
  const mockSupabaseClient: Pick<ResolvedSupabaseClient, 'from' | 'auth'> = {
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
    } as unknown as ResolvedSupabaseClient['auth'],
  };

  beforeEach(() => {
    vi.mocked(serverClient).mockResolvedValue(mockSupabaseClient as unknown as ResolvedSupabaseClient);
  });

  it('should return unauthorized error if there is no authenticated user session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await updateSchemaAction('{"openapi": "3.0.0"}', 'JSON');

    expect(serverClient).toHaveBeenCalledTimes(1);
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(saveSchema).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('should successfully invoke saveSchema and return its result when user is authenticated', async () => {
    const mockUser = { id: 'auth-user-777' };
    const mockContent = 'openapi: 3.0.0';
    const mockFormat = 'YAML';
    const mockServiceResponse = { success: true };

    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    vi.mocked(saveSchema).mockResolvedValue(mockServiceResponse);

    const result = await updateSchemaAction(mockContent, mockFormat);

    expect(serverClient).toHaveBeenCalledTimes(1);
    expect(mockGetUser).toHaveBeenCalledTimes(1);

    expect(saveSchema).toHaveBeenCalledWith(expect.any(Object), mockUser.id, mockContent, mockFormat);
    expect(result).toEqual(mockServiceResponse);
  });
});
