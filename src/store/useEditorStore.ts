import { create } from 'zustand';
import { type EditorFormat } from '@/types';
import { detectFormat } from '@/utils/editor/detectFormat/detectFormat';
import { validateSchema } from '@/utils/editor/validateSchema/validateSchema';

export type ValidationError = {
  path: string;
  message: string;
};

type EditorState = {
  schema: string;
  validSchema: string;
  format: EditorFormat;
  errors: ValidationError[];

  isValid: boolean;
  isValidating: boolean;

  debounceTimeoutId: NodeJS.Timeout | null;

  setFormat: (format: EditorFormat) => void;
  updateSchema: (text: string, onCriticalError?: (msg: string) => void) => void;
  clearErrors: () => void;
};

const AUTO_DETECT_DELAY = 600;

export const useEditorStore = create<EditorState>((set, get) => ({
  schema: '',
  validSchema: '',
  format: 'JSON',
  errors: [],
  isValid: true,
  isValidating: false,
  debounceTimeoutId: null,

  setFormat: (format): void => set({ format }),

  clearErrors: (): void => set({ errors: [], isValid: true }),

  updateSchema: (text): void => {
    const { debounceTimeoutId, format, validSchema } = get();

    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
    }

    set({ schema: text });

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
        set({ format: detectedFormat });

        const validationErrors = await validateSchema(text, detectedFormat);
        const hasNoErrors = validationErrors.length === 0;

        set({
          errors: validationErrors,
          isValid: hasNoErrors,
          validSchema: hasNoErrors ? text : validSchema,
          isValidating: false,
        });
      })();
    }, AUTO_DETECT_DELAY);

    set({ debounceTimeoutId: timeoutId });
  },
}));
