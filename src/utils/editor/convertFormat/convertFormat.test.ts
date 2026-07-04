import { describe, expect, it } from 'vitest';
import { jsonToYaml, yamlToJson } from './convertFormat';

describe('Convert Schema', () => {
  describe('jsonToYaml', () => {
    it('converts JSON object to YAML', () => {
      const json = `{
        "name": "John",
        "age": 30
      }`;

      expect(jsonToYaml(json)).toContain('name: John');
      expect(jsonToYaml(json)).toContain('age: 30');
    });
  });

  describe('yamlToJson', () => {
    it('converts YAML to JSON', () => {
      const yaml = `
  name: John
  age: 30
  `;

      expect(yamlToJson(yaml)).toBe(
        JSON.stringify(
          {
            name: 'John',
            age: 30,
          },
          null,
          2,
        ),
      );
    });
  });

  describe('invalid JSON', () => {
    it('throws for invalid JSON', () => {
      expect(() => jsonToYaml('{"name":}')).toThrow('notifications.jsonToYaml');
    });
  });

  describe('invalid YAML', () => {
    it('throws for invalid YAML', () => {
      expect(() => yamlToJson('name: test: test')).toThrow('notifications.yamlToJson');
    });
  });

  describe('primitive YAML', () => {
    it('throws for primitive YAML values', () => {
      expect(() => yamlToJson('123')).toThrow();
    });

    it('throws for null YAML', () => {
      expect(() => yamlToJson('null')).toThrow();
    });
  });
});
