import { parse } from 'yaml';
import { type Endpoint } from '@/types';
import { HTTP_METHODS } from '@/constants';

const HTTP_METHOD_ORDER = {
  get: 0,
  post: 1,
  put: 2,
  patch: 3,
  delete: 4,
} satisfies Record<Endpoint['method'], number>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const getEndpoints = (schema: string): Endpoint[] => {
  const parsedSchema: unknown = parse(schema);

  if (!isRecord(parsedSchema) || !isRecord(parsedSchema.paths)) {
    return [];
  }

  const endpoints: Endpoint[] = [];

  for (const [path, pathItem] of Object.entries(parsedSchema.paths)) {
    if (!isRecord(pathItem)) {
      continue;
    }

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];

      if (!isRecord(operation)) {
        continue;
      }

      const summary = typeof operation.summary === 'string' ? operation.summary : null;

      endpoints.push({
        path,
        method,
        summary,
      });
    }
  }

  return endpoints.toSorted((firstEndpoint, secondEndpoint) => {
    const pathComparison = firstEndpoint.path.localeCompare(secondEndpoint.path);

    if (pathComparison !== 0) {
      return pathComparison;
    }

    return HTTP_METHOD_ORDER[firstEndpoint.method] - HTTP_METHOD_ORDER[secondEndpoint.method];
  });
};
