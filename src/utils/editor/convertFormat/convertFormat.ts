import { load, dump } from 'js-yaml';

export function jsonToYaml(jsonText: string): string {
  try {
    const obj: unknown = JSON.parse(jsonText);

    return dump(obj, { indent: 2, lineWidth: -1 });
  } catch {
    throw new Error('notifications.jsonToYaml');
  }
}

export function yamlToJson(yamlText: string): string {
  try {
    const obj = load(yamlText);
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('notifications.invalidYaml');
    }
    return JSON.stringify(obj, null, 2);
  } catch {
    throw new Error('notifications.yamlToJson');
  }
}
