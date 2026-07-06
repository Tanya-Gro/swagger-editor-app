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
  let obj: unknown;
  try {
    obj = load(yamlText);
  } catch {
    throw new Error('notifications.yamlToJson');
  }

  if (typeof obj !== 'object' || obj === null) {
    throw new Error('notifications.invalidYaml');
  }

  return JSON.stringify(obj, null, 2);
}
