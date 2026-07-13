import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useEditorStore } from './useEditorStore';
import { validateSchema } from '@/utils/editor/validateSchema/validateSchema';
import { detectFormat } from '@/utils/editor/detectFormat/detectFormat';

vi.mock('@/utils/editor/validateSchema/validateSchema', () => ({
  validateSchema: vi.fn(),
}));

vi.mock('@/utils/editor/detectFormat/detectFormat', () => ({
  detectFormat: vi.fn(),
}));

describe('useEditorStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useEditorStore.getState().clearErrors();
    useEditorStore.setState({
      schema: '',
      validSchema: '',
      format: 'JSON',
      errors: [],
      isValid: true,
      isValidating: false,
      debounceTimeoutId: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const state = useEditorStore.getState();
    expect(state.schema).toBe('');
    expect(state.validSchema).toBe('');
    expect(state.format).toBe('JSON');
    expect(state.errors).toEqual([]);
    expect(state.isValid).toBe(true);
    expect(state.isValidating).toBe(false);
  });

  it('should correctly reset state on empty input', () => {
    const store = useEditorStore.getState();
    store.updateSchema('');

    const state = useEditorStore.getState();
    expect(state.schema).toBe('');
    expect(state.validSchema).toBe('');
    expect(state.errors).toEqual([]);
    expect(state.isValid).toBe(true);
  });

  it('should automatically detect JSON format and successfully validate schema', async () => {
    const validJson = '{"openapi": "3.0.0", "info": {"title": "Test"}}';
    vi.mocked(detectFormat).mockReturnValue('JSON');
    vi.mocked(validateSchema).mockResolvedValue([]);
    useEditorStore.getState().updateSchema(validJson);

    expect(useEditorStore.getState().isValidating).toBe(true);
    await vi.advanceTimersByTimeAsync(600);

    const state = useEditorStore.getState();
    expect(state.format).toBe('JSON');
    expect(state.isValid).toBe(true);
    expect(state.errors).toEqual([]);
    expect(state.validSchema).toBe(validJson);
    expect(state.isValidating).toBe(false);
  });

  it('should automatically detect YAML format and successfully validate schema', async () => {
    const validYaml = 'openapi: 3.0.0\ninfo:\n  title: Test';
    vi.mocked(detectFormat).mockReturnValue('YAML');
    vi.mocked(validateSchema).mockResolvedValue([]);

    useEditorStore.getState().updateSchema(validYaml);
    await vi.advanceTimersByTimeAsync(600);

    const state = useEditorStore.getState();
    expect(state.format).toBe('YAML');
    expect(state.isValid).toBe(true);
    expect(state.errors).toEqual([]);
    expect(state.validSchema).toBe(validYaml);
  });

  it('should record specification errors if OpenAPI is invalid', async () => {
    const invalidJson = '{"info": {"title": "No Openapi Property"}}';
    const mockErrors = [{ path: 'paths', message: "should have required property 'paths'", isCritical: false }];

    vi.mocked(detectFormat).mockReturnValue('JSON');
    vi.mocked(validateSchema).mockResolvedValue(mockErrors);

    useEditorStore.getState().updateSchema(invalidJson);
    await vi.advanceTimersByTimeAsync(600);

    const state = useEditorStore.getState();
    expect(state.isValid).toBe(false);
    expect(state.errors).toEqual(mockErrors);
    expect(state.validSchema).toBe('');
  });
});
