import { create } from 'zustand';
import { type EditorFormat, type ValidationError } from '@/types';
import { detectFormat } from '@/utils/editor/detectFormat/detectFormat';
import { validateSchema } from '@/utils/editor/validateSchema/validateSchema';
import { updateSchemaAction } from '@/app/actions/schemaActions';

type EditorState = {
  schema: string;
  validSchema: string;
  format: EditorFormat;
  errors: ValidationError[];

  isValid: boolean;
  isValidating: boolean;
  isHydrated: boolean;

  debounceTimeoutId: NodeJS.Timeout | null;
  validationGeneration: number;

  saveTimeoutId: NodeJS.Timeout | null;

  setFormat: (format: EditorFormat) => void;
  updateSchema: (text: string, onCriticalError?: (msg: string) => void) => void;
  clearErrors: () => void;
  // loadAuthenticatedSchema: () => Promise<void>;
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

  isHydrated: false,

  setFormat: (format): void => set({ format }),

  clearErrors: (): void => set({ errors: [], isValid: true }),

  updateSchema: (text): void => {
    const { debounceTimeoutId, saveTimeoutId, format, validSchema, validationGeneration } = get();

    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
    }
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }

    const nextGeneration = validationGeneration + 1;
    set({ schema: text, validationGeneration: nextGeneration });

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
            void updateSchemaAction(text, get().format);
          }, DB_SAVE_DELAY);

          set({ saveTimeoutId: dbTimeoutId });
        }
      })();
    }, AUTO_DETECT_DELAY);

    set({ debounceTimeoutId: timeoutId });
  },
}));
