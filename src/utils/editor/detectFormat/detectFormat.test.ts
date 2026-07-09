import { describe, expect, it } from 'vitest';
import { detectFormat } from './detectFormat';

describe('detectFormat', () => {
  describe('JSON detection', () => {
    it('should detect valid JSON object', () => {
      const json = '{"name": "test", "value": 123}';
      expect(detectFormat(json)).toBe('JSON');
    });

    it('should detect valid JSON array', () => {
      const json = '[1, 2, 3, "test"]';
      expect(detectFormat(json)).toBe('JSON');
    });
  });

  describe('YAML detection', () => {
    it('should detect YAML with key-value pairs', () => {
      const yaml = 'name: test\nvalue: 123';
      expect(detectFormat(yaml)).toBe('YAML');
    });

    it('should detect YAML with lists', () => {
      const yaml = 'items:\n  - item1\n  - item2\n  - item3';
      expect(detectFormat(yaml)).toBe('YAML');
    });

    it('should detect YAML with nested structures', () => {
      const yaml = `user:
  name: John
  age: 30
tags:
  - admin
  - user`;
      expect(detectFormat(yaml)).toBe('YAML');
    });

    it('should detect YAML with comments', () => {
      const yaml = `# This is a comment
name: test
value: 123`;
      expect(detectFormat(yaml)).toBe('YAML');
    });

    it('should detect YAML with multiline strings', () => {
      const yaml = `description: |
  This is a
  multiline string`;
      expect(detectFormat(yaml)).toBe('YAML');
    });

    it('should detect YAML with anchors and aliases', () => {
      const yaml = `defaults: &defaults
  timeout: 30
  retries: 3
task:
  <<: *defaults
  name: test`;
      expect(detectFormat(yaml)).toBe('YAML');
    });

    it('should detect YAML with tags', () => {
      const yaml = 'value: !!str 123';
      expect(detectFormat(yaml)).toBe('YAML');
    });
  });

  describe('Edge cases', () => {
    it('should prefer JSON over YAML when both valid', () => {
      const ambiguous = '{"key": "value"}';
      expect(detectFormat(ambiguous)).toBe('JSON');
    });

    it('should handle very large strings', () => {
      const largeJSON = JSON.stringify({
        data: Array.from({ length: 1000 }).fill({ id: 1, name: 'test' }),
      });
      expect(detectFormat(largeJSON)).toBe('JSON');
    });

    it('should handle strings with special characters', () => {
      const yamlWithSpecial = 'key: "value with special chars: @#$%^&*()"';
      expect(detectFormat(yamlWithSpecial)).toBe('YAML');
    });
  });
});
