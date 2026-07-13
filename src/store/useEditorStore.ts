import { create } from 'zustand';
import { detectFormat } from '@/utils/editor/detectFormat/detectFormat';
import { validateSchema } from '@/utils/editor/validateSchema/validateSchema';
import { updateSchemaAction } from '@/app/actions/schemaActions';
import type { EditorFormat, ValidationError } from '@/types';

type EditorState = {
  schema: string;
  validSchema: string;
  format: EditorFormat;
  errors: ValidationError[];

  isValid: boolean;
  isValidating: boolean;

  isHydrated: boolean;
  saveStatus: 'idle' | 'success' | 'error';

  debounceTimeoutId: NodeJS.Timeout | null;
  validationGeneration: number;

  saveTimeoutId: NodeJS.Timeout | null;

  setFormat: (format: EditorFormat) => void;
  updateSchema: (text: string, onCriticalError?: (msg: string) => void) => void;
  clearErrors: () => void;
};

const AUTO_DETECT_DELAY = 600;
const DB_SAVE_DELAY = 2000;

export const useEditorStore = create<EditorState>((set, get) => ({
  schema: '',
  validSchema: '',
  format: 'JSON',
  errors: [],
  isValid: true,
  isValidating: false,
  debounceTimeoutId: null,
  validationGeneration: 0,
  saveTimeoutId: null,

  saveStatus: 'idle',
  isHydrated: false,

  setFormat: (format): void => set({ format }),

  clearErrors: (): void => set({ errors: [], isValid: true, saveStatus: 'idle' }),

  updateSchema: (text): void => {
    const { debounceTimeoutId, saveTimeoutId, format, validSchema, validationGeneration } = get();

    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
    }
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }

    const nextGeneration = validationGeneration + 1;
    set({ schema: text, validationGeneration: nextGeneration, saveStatus: 'idle' });

    if (!text.trim()) {
      set({
        errors: [],
        isValid: true,
        validSchema: '',
        isValidating: false,
        format: format === 'unknown' ? 'JSON' : format,
      });
      return;
    }

    set({ isValidating: true });

    const timeoutId = setTimeout(() => {
      void (async (): Promise<void> => {
        const detectedFormat = detectFormat(text);

        if (get().validationGeneration !== nextGeneration) {
          return;
        }

        set({ format: detectedFormat });

        const validationErrors = await validateSchema(text, detectedFormat);

        if (get().validationGeneration !== nextGeneration) {
          return;
        }

        const hasNoErrors = validationErrors.length === 0;

        set({
          errors: validationErrors,
          isValid: hasNoErrors,
          validSchema: hasNoErrors ? text : validSchema,
          isValidating: false,
        });

        if (hasNoErrors) {
          const dbTimeoutId = setTimeout(() => {
            void (async (): Promise<void> => {
              const generationAtSave = nextGeneration;

              if (get().validationGeneration !== generationAtSave) {
                return;
              }

              try {
                const result = await updateSchemaAction(text, detectedFormat);

                if (get().validationGeneration !== generationAtSave) {
                  return;
                }

                if ('success' in result && !result.success) {
                  set({ saveStatus: 'error' });
                  return;
                }

                set({ saveStatus: 'success' });
              } catch {
                if (get().validationGeneration !== generationAtSave) {
                  return;
                }
                set({ saveStatus: 'error' });
              }
            })();
          }, DB_SAVE_DELAY);

          set({ saveTimeoutId: dbTimeoutId });
        }
      })();
    }, AUTO_DETECT_DELAY);

    set({ debounceTimeoutId: timeoutId });
  },
}));
