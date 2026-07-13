import { parse } from 'yaml';
import { type Endpoint, type SwaggerDocument } from '@/types';
import { HTTP_METHODS } from '@/constants';

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
