import { type EditorFormat } from '@/types';

export function detectFormat(text: string): EditorFormat {
  const trimmed = text.trim();

  if (trimmed === '') {
    return 'JSON';
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'JSON';
  }

  return 'YAML';
}
