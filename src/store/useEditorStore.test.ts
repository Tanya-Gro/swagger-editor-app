import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import { useEditorStore } from './useEditorStore';
import { validateSchema } from '@/utils/editor/validateSchema/validateSchema';
import { detectFormat } from '@/utils/editor/detectFormat/detectFormat';
import { updateSchemaAction } from '@/app/actions/schemaActions';

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
});

vi.mock('@/app/actions/schemaActions', () => ({
  updateSchemaAction: vi.fn(() => Promise.resolve({ success: true })),
}));

vi.mock('@/utils/editor/validateSchema/validateSchema', () => ({
  validateSchema: vi.fn(() => Promise.resolve([])),
}));

vi.mock('@/utils/editor/detectFormat/detectFormat', () => ({
  detectFormat: vi.fn(),
}));

vi.mock('@/app/actions/schemaActions', () => ({
  updateSchemaAction: vi.fn(() => ({ success: true })),
}));

let resolveServerRequest: (value: { success: boolean }) => void;

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
      isHydrated: true,
      isValidating: false,
      validationGeneration: 0,
      debounceTimeoutId: null,
      saveTimeoutId: null,
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

  it('should run validation after AUTO_DETECT_DELAY and trigger server save after DB_SAVE_DELAY', async () => {
    vi.mocked(detectFormat).mockReturnValue('JSON');
    vi.mocked(validateSchema).mockResolvedValue([]);
    vi.mocked(updateSchemaAction).mockResolvedValue({ success: true });

    useEditorStore.getState().updateSchema('{"valid": true}');

    expect(useEditorStore.getState().isValidating).toBe(true);
    expect(useEditorStore.getState().saveStatus).toBe('idle');

    await vi.advanceTimersByTimeAsync(600);

    expect(detectFormat).toHaveBeenCalledWith('{"valid": true}');
    expect(validateSchema).toHaveBeenCalledWith('{"valid": true}', 'JSON');
    expect(useEditorStore.getState().isValidating).toBe(false);
    expect(useEditorStore.getState().validSchema).toBe('{"valid": true}');

    const savePromise = vi.advanceTimersByTimeAsync(2000);

    await savePromise;

    expect(updateSchemaAction).toHaveBeenCalledWith('{"valid": true}', 'JSON');
    expect(useEditorStore.getState().saveStatus).toBe('success');
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

  it('should set saveStatus to error if updateSchemaAction returns success false', async () => {
    vi.mocked(validateSchema).mockResolvedValue([]);
    vi.mocked(updateSchemaAction).mockResolvedValue({ success: false });

    useEditorStore.getState().updateSchema('{"valid": true}');

    await vi.advanceTimersByTimeAsync(2700);

    expect(useEditorStore.getState().saveStatus).toBe('error');
  });

  it('should set saveStatus to error if updateSchemaAction rejects (network crash)', async () => {
    vi.mocked(validateSchema).mockResolvedValue([]);
    vi.mocked(updateSchemaAction).mockRejectedValue(new Error('DB Network Crash'));

    useEditorStore.getState().updateSchema('{"valid": true}');
    await vi.advanceTimersByTimeAsync(2700);

    expect(useEditorStore.getState().saveStatus).toBe('error');
  });

  it('should NOT save to DB if schema validation fails', async () => {
    const mockErrors = [{ path: 'root', message: 'invalid' }];
    vi.mocked(validateSchema).mockResolvedValue(mockErrors);

    useEditorStore.getState().updateSchema('{"invalid": }');
    await vi.advanceTimersByTimeAsync(2600);

    const state = useEditorStore.getState();
    expect(state.isValid).toBe(false);
    expect(state.errors).toEqual(mockErrors);
    expect(updateSchemaAction).not.toHaveBeenCalled();
    expect(state.saveStatus).toBe('idle');
  });

  it('should cancel previous save timers if a new schema is typed before save executes', async () => {
    vi.mocked(validateSchema).mockResolvedValue([]);

    useEditorStore.getState().updateSchema('{"first": 1}');
    await vi.advanceTimersByTimeAsync(600);

    await vi.advanceTimersByTimeAsync(1000);
    useEditorStore.getState().updateSchema('{"first": 1, "second": 2}');

    await vi.advanceTimersByTimeAsync(1000);
    expect(updateSchemaAction).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2600);
    expect(updateSchemaAction).toHaveBeenCalledTimes(1);
    expect(updateSchemaAction).toHaveBeenCalledWith('{"first": 1, "second": 2}', 'JSON');
  });

  it('CRITICAL RACE CONDITION: should ignore server response if validationGeneration changed while request was in-flight', async () => {
    vi.mocked(validateSchema).mockResolvedValue([]);

    vi.mocked(updateSchemaAction).mockImplementation(() => {
      return new Promise((resolve) => {
        resolveServerRequest = resolve;
      });
    });

    useEditorStore.getState().updateSchema('{"schema": "A"}');
    await vi.advanceTimersByTimeAsync(2600);

    useEditorStore.getState().updateSchema('{"schema": "B"}');

    resolveServerRequest({ success: true });
    await new Promise(process.nextTick);

    expect(useEditorStore.getState().saveStatus).toBe('idle');
    expect(useEditorStore.getState().schema).toBe('{"schema": "B"}');
  });
});
