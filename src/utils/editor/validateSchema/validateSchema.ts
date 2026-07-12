import SwaggerParser from '@apidevtools/swagger-parser';
import { load } from 'js-yaml';
import type { EditorFormat, ValidationError } from '@/types';

type Detail = {
  instancePath?: string;
  keyword?: string;
  message?: string;
  params?: {
    missingProperty?: string;
    type?: string;
  };
};

type SwaggerParserError = {
  details: Detail[];
};

type YamlMarkError = {
  message: string;
  mark: {
    line: number;
  };
};

type SwaggerDocument = Parameters<typeof SwaggerParser.validate>[0];

function isSwaggerParserError(error: unknown): error is SwaggerParserError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return 'details' in error && Array.isArray(error.details);
}

function isYamlMarkError(error: unknown): error is YamlMarkError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return 'message' in error && 'mark' in error && typeof error.mark === 'object' && error.mark !== null;
}

function isSwaggerDocument(candidate: unknown): candidate is SwaggerDocument {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const hasVersion =
    ('openapi' in candidate && typeof candidate.openapi === 'string') ||
    ('swagger' in candidate && typeof candidate.swagger === 'string');
  const hasInfo = 'info' in candidate && typeof candidate.info === 'object' && candidate.info !== null;
  const hasPaths = 'paths' in candidate && typeof candidate.paths === 'object' && candidate.paths !== null;

  return hasVersion && hasInfo && hasPaths;
}

export async function validateSchema(text: string, format: EditorFormat): Promise<ValidationError[]> {
  try {
    const parsedObj: unknown = format === 'JSON' ? JSON.parse(text) : load(text);

    if (typeof parsedObj !== 'object' || parsedObj === null) {
      return [{ path: 'root', message: 'notifications.invalidObject' }];
    }

    const clonedObj: unknown = structuredClone(parsedObj);

    if (!isSwaggerDocument(clonedObj)) {
      return [{ path: 'root', message: 'notifications.invalidObject' }];
    }

    await SwaggerParser.validate(clonedObj);

    return [];
  } catch (error) {
    if (isSwaggerParserError(error)) {
      return error.details.map((detail) => {
        const rawPath = detail.instancePath ?? '';

        let cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;

        cleanPath = cleanPath.replaceAll('/', '.').replaceAll('~1', '/').replaceAll('~0', '~');

        if (detail.keyword === 'required' && detail.params?.missingProperty) {
          const missingProp = detail.params.missingProperty;
          cleanPath = cleanPath ? `${cleanPath}.${missingProp}` : missingProp;
        }

        return {
          path: cleanPath || 'specification',
          message: detail.message ?? 'notifications.unknownValidationError',
        };
      });
    }

    if (isYamlMarkError(error)) {
      const lineNum = error.mark.line;
      const lineInfo = typeof lineNum === 'number' ? `Line ${String(lineNum + 1)}` : 'syntax';
      return [{ path: lineInfo, message: error.message || 'notifications.invalidStructure' }];
    }

    return [{ path: 'syntax', message: error instanceof Error ? error.message : 'notifications.unknownError' }];
  }
}
