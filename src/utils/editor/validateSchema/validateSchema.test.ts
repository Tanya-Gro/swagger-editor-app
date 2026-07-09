import { describe, it, expect, vi } from 'vitest';
import SwaggerParser from '@apidevtools/swagger-parser';
import { load } from 'js-yaml';
import { validateSchema } from './validateSchema';

vi.mock('@apidevtools/swagger-parser', () => ({
  default: {
    validate: vi.fn(),
  },
}));

vi.mock('js-yaml', () => ({
  load: vi.fn(),
}));

describe('validateSchema Utility', () => {
  it('should return an empty array when schema is completely valid', async () => {
    const validJson = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {},
    });

    const mockDocument = {
      openapi: '3.0.0',
      info: { title: 'Mock', version: '1.0' },
      paths: {},
    };

    vi.mocked(SwaggerParser.validate).mockResolvedValue(mockDocument);

    const result = await validateSchema(validJson, 'JSON');

    expect(result).toEqual([]);
    expect(SwaggerParser.validate).toHaveBeenCalledTimes(1);
  });

  it('should return a critical error if the input is not a valid JSON/YAML object', async () => {
    const invalidInput = '"just a plain string, not an object"';

    const result = await validateSchema(invalidInput, 'JSON');

    expect(result).toEqual([
      {
        path: 'root',
        message: 'notifications.invalidObject',
      },
    ]);
  });

  it('should return a non-critical error if the structure is missing required OpenAPI elements', async () => {
    const incompleteJson = JSON.stringify({
      openapi: '3.0.0',
    });

    const result = await validateSchema(incompleteJson, 'JSON');

    expect(result).toEqual([
      {
        path: 'root',
        message: 'notifications.invalidObject',
      },
    ]);
    expect(SwaggerParser.validate).not.toHaveBeenCalled();
  });

  it('should correctly format paths and append missing properties for required keyword errors', async () => {
    const invalidJson = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'My API' },
      paths: {},
    });

    const mockSwaggerError = {
      details: [
        {
          instancePath: '/info',
          keyword: 'required',
          params: { missingProperty: 'version' },
          message: "must have required property 'version'",
        },
      ],
    };

    vi.mocked(SwaggerParser.validate).mockRejectedValue(mockSwaggerError);

    const result = await validateSchema(invalidJson, 'JSON');

    expect(result).toEqual([
      {
        path: '.info.version',
        message: "must have required property 'version'",
      },
    ]);
  });

  it('should correctly unescape JSON Pointer tokens like ~1 and ~0 in paths', async () => {
    const invalidJson = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'API', version: '1.0.0' },
      paths: { '/users': 'invalid_type' },
    });

    const mockSwaggerError = {
      details: [
        {
          instancePath: '/paths/~1users',
          keyword: 'type',
          message: 'must be object',
        },
      ],
    };

    vi.mocked(SwaggerParser.validate).mockRejectedValue(mockSwaggerError);

    const result = await validateSchema(invalidJson, 'JSON');

    expect(result).toEqual([
      {
        path: '.paths./users',
        message: 'must be object',
      },
    ]);
  });

  it('should fallback to specification path if cleanPath resolves to an empty string', async () => {
    const invalidJson = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'API', version: '1.0.0' },
      paths: {},
    });

    const mockSwaggerError = {
      details: [
        {
          instancePath: '',
          message: 'Root schema error',
        },
      ],
    };

    vi.mocked(SwaggerParser.validate).mockRejectedValue(mockSwaggerError);

    const result = await validateSchema(invalidJson, 'JSON');

    expect(result).toEqual([
      {
        path: 'specification',
        message: 'Root schema error',
      },
    ]);
  });

  it('should catch critical YAML syntax errors with line mapping numbers', async () => {
    const brokenYaml = 'openapi: 3.0.0\n  info: broken_indentation';
    const mockYamlError = new Error('bad indentation of a mapping entry');
    Object.defineProperty(mockYamlError, 'mark', {
      value: { line: 1 },
      writable: true,
    });

    vi.mocked(load).mockImplementation(() => {
      throw mockYamlError;
    });

    const result = await validateSchema(brokenYaml, 'YAML');

    expect(result).toEqual([
      {
        path: 'Line 2',
        message: 'bad indentation of a mapping entry',
      },
    ]);
  });
});
