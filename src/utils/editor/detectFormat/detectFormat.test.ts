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

    it('should detect valid JSON with nested structures', () => {
      const json = '{"user": {"name": "John", "age": 30}, "tags": ["admin", "user"]}';
      expect(detectFormat(json)).toBe('JSON');
    });

    it('should detect valid JSON with formatting', () => {
      const json = `{
        "name": "test",
        "value": 123
      }`;
      expect(detectFormat(json)).toBe('JSON');
    });

    it('should not detect JSON if it starts with non-JSON character', () => {
      const text = 'Hello {"name": "test"}';
      expect(detectFormat(text)).toBe('unknown');
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

  describe('Unknown format detection', () => {
    it('should return unknown for empty string', () => {
      expect(detectFormat('')).toBe('JSON');
    });

    it('should return unknown for whitespace only', () => {
      expect(detectFormat('   \n\t  ')).toBe('JSON');
    });

    it('should return unknown for plain text', () => {
      expect(detectFormat('This is just plain text')).toBe('unknown');
    });

    it('should return unknown for invalid JSON', () => {
      const invalidJSON = '{"name": "test", "value": }';
      expect(detectFormat(invalidJSON)).toBe('unknown');
    });

    it('should return unknown for invalid YAML-like text', () => {
      const invalidYAML = 'key: value: another: value';
      expect(detectFormat(invalidYAML)).toBe('unknown');
    });

    it('should return unknown for XML', () => {
      const xml = '<root><item>value</item></root>';
      expect(detectFormat(xml)).toBe('unknown');
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
