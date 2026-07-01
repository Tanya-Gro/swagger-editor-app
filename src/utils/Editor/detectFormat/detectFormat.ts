import { load } from 'js-yaml';
import { type EditorFormat } from '@/types';

export function detectFormat(text: string): EditorFormat {
  const trimmed = text.trim();

  if (trimmed === '') {
    return 'unknown';
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'JSON';
    } catch {
      return 'unknown';
    }
  }

  const hasYamlStructure = /:\s|\n-\s/.test(trimmed);
  if (hasYamlStructure) {
    try {
      const result = load(text);
      if (typeof result === 'object' && result !== null) {
        return 'YAML';
      }
    } catch {
      return 'unknown';
    }
  }

  return 'unknown';
}
