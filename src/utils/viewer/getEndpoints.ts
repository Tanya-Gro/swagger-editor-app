import { parse } from 'yaml';
import { sample } from 'openapi-sampler';

import { type Endpoint, type SwaggerDocument, type JsonValue, type RequestBody, type MediaTypeObject } from '@/types';
import { HTTP_METHODS } from '@/types';

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null;
}

function isSwaggerDocument(candidate: unknown): candidate is SwaggerDocument {
  if (!isRecord(candidate)) {
    return false;
  }

  const hasVersion = typeof candidate.openapi === 'string' || typeof candidate.swagger === 'string';

  return hasVersion && isRecord(candidate.info) && isRecord(candidate.paths);
}

function isJsonValue(candidate: unknown): candidate is JsonValue {
  if (
    candidate === null ||
    typeof candidate === 'string' ||
    typeof candidate === 'number' ||
    typeof candidate === 'boolean'
  ) {
    return true;
  }

  if (Array.isArray(candidate)) {
    return candidate.every(isJsonValue);
  }

  if (!isRecord(candidate)) {
    return false;
  }

  return Object.values(candidate).every(isJsonValue);
}

function getJsonMediaType(requestBody: RequestBody): MediaTypeObject | null {
  if (requestBody.content === undefined) {
    return null;
  }

  for (const [mediaType, mediaTypeObject] of Object.entries(requestBody.content)) {
    if (mediaType === 'application/json' || mediaType.endsWith('+json')) {
      return mediaTypeObject;
    }
  }

  return null;
}

function getRequestBodyExample(requestBody: RequestBody | undefined, document: SwaggerDocument): JsonValue | null {
  if (requestBody === undefined) {
    return null;
  }

  const mediaType = getJsonMediaType(requestBody);

  if (mediaType === null) {
    return null;
  }

  if (mediaType.example !== undefined) {
    return isJsonValue(mediaType.example) ? mediaType.example : null;
  }

  if (mediaType.schema === undefined) {
    return null;
  }

  const example: unknown = sample(
    mediaType.schema,
    {
      skipReadOnly: true,
      skipWriteOnly: false,
      quiet: true,
    },
    document,
  );

  return isJsonValue(example) ? example : null;
}

export function getEndpoints(schema: string): Endpoint[] {
  const parsedSchema: unknown = parse(schema);

  if (!isSwaggerDocument(parsedSchema)) {
    return [];
  }

  const endpoints: Endpoint[] = [];

  for (const [pathname, pathItem] of Object.entries(parsedSchema.paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];

      if (!operation) {
        continue;
      }

      endpoints.push({
        pathname,
        method,
        summary: operation.summary ?? null,
        tags: operation.tags ?? [],
        parameters: operation.parameters ?? [],
        requestBody: operation.requestBody ?? null,
        requestBodyExample: getRequestBodyExample(operation.requestBody, parsedSchema),
        responses: operation.responses,
      });
    }
  }

  return endpoints.toSorted((firstEndpoint, secondEndpoint) => {
    const pathnameComparison = firstEndpoint.pathname.localeCompare(secondEndpoint.pathname);

    if (pathnameComparison !== 0) {
      return pathnameComparison;
    }

    return HTTP_METHODS.indexOf(firstEndpoint.method) - HTTP_METHODS.indexOf(secondEndpoint.method);
  });
}
