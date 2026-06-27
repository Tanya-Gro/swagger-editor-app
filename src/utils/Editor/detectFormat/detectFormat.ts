import { type EditorFormat } from '@/types';
import yaml from 'js-yaml';

export function detectFormat(text: string): EditorFormat | 'unknown' {
  if (!text || text.trim() === '') {
    return 'unknown';
  }

  const trimmed = text.trim();

  if (isJSON(trimmed)) {
    return 'JSON';
  }

  if (isYAML(trimmed)) {
    return 'YAML';
  }

  return 'unknown';
}

function isJSON(text: string): boolean {
  try {
    const firstChar = text.charAt(0);

    if (firstChar !== '{' && firstChar !== '[') {
      return false;
    }

    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function isYAML(text: string): boolean {
  try {
    yaml.load(text);
    return true;
  } catch {
    return false;
  }
}
