import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSchema, saveSchema } from './schemaService';
import { validateSchema } from '@/utils/editor/validateSchema/validateSchema';
import type { SupabaseClient } from '@supabase/supabase-js';

vi.mock('@/utils/editor/validateSchema/validateSchema', () => ({
  validateSchema: vi.fn(),
}));

vi.mock('@/utils/editor/detectFormat/detectFormat', () => ({
  detectFormat: vi.fn(() => 'JSON'),
}));

describe('schemaService', () => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn();
  const mockSelect = vi.fn();
  const mockUpsert = vi.fn();
  const mockFrom = vi.fn();

  const mockSupabaseClient: Pick<SupabaseClient, 'from'> = {
    from: mockFrom,
  };

  beforeEach(() => {
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'openapi_schemas') {
        return {
          select: mockSelect,
          upsert: mockUpsert,
        };
      }
      return { select: mockSelect, upsert: mockUpsert };
    });
  });

  describe('getSchema', () => {
    it('should return parsed string and correct format when data exists in DB', async () => {
      mockSingle.mockResolvedValue({
        data: {
          content: { openapi: '3.0.0', info: { title: 'Test' } },
          original_format: 'JSON',
        },
        error: null,
      });

      const result = await getSchema(mockSupabaseClient, 'user-123');

      expect(mockFrom).toHaveBeenCalledWith('openapi_schemas');
      expect(mockSelect).toHaveBeenCalledWith('content, original_format');
      expect(mockEq).toHaveBeenCalledWith('owner_id', 'user-123');
      expect(result).not.toBeNull();
      expect(result?.format).toBe('JSON');
      expect(result?.schema).toContain('"openapi": "3.0.0"');
    });

    it('should return null if Supabase returns an error or no data', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } });

      const result = await getSchema(mockSupabaseClient, 'user-123');

      expect(result).toBeNull();
    });
  });

  describe('saveSchema', () => {
    it('should return success true when schema is valid and upsert succeeds', async () => {
      const validContent = '{"openapi": "3.0.0"}';

      vi.mocked(validateSchema).mockResolvedValue([]);
      mockUpsert.mockResolvedValue({ error: null });

      const result = await saveSchema(mockSupabaseClient, 'user-123', validContent, 'JSON');

      expect(validateSchema).toHaveBeenCalledWith(validContent, 'JSON');
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          owner_id: 'user-123',
          original_format: 'json',
          content: { openapi: '3.0.0' },
        }),
        { onConflict: 'owner_id' },
      );
      expect(result).toEqual({ success: true });
    });

    it('should fail fast and return error if server-side validation fails', async () => {
      const invalidContent = '{"broken": "schema"}';

      vi.mocked(validateSchema).mockResolvedValue([{ path: 'root', message: 'Invalid property' }]);

      const result = await saveSchema(mockSupabaseClient, 'user-123', invalidContent, 'JSON');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Server-side validation failed');
      expect(mockUpsert).not.toHaveBeenCalled();
    });

    it('should return error if Supabase upsert fails', async () => {
      const validContent = '{"openapi": "3.0.0"}';

      vi.mocked(validateSchema).mockResolvedValue([]);
      mockUpsert.mockResolvedValue({ error: { message: 'Database connection timeout' } });

      const result = await saveSchema(mockSupabaseClient, 'user-123', validContent, 'JSON');

      expect(result).toEqual({
        success: false,
        error: 'Database connection timeout',
      });
    });
  });
});
