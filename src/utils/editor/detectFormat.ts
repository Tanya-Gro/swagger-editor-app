import { load } from 'js-yaml';
import { type EditorFormat } from '@/types';

export function detectFormat(text: string): EditorFormat {
  const trimmed = text.trim();

  if (trimmed === '') {
    return 'JSON';
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'JSON';
    } catch {
      return 'unknown';
    }
  }

  try {
    const result = load(text);
    if (typeof result === 'object' && result !== null) {
      return 'YAML';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}
