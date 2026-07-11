import { parse } from 'yaml';
import { type Endpoint, type ParameterLocation, type EndpointParameter } from '@/types';
import { HTTP_METHODS, PARAMETER_LOCATIONS } from '@/constants';

const HTTP_METHOD_ORDER = {
  get: 0,
  post: 1,
  put: 2,
  patch: 3,
  delete: 4,
} satisfies Record<Endpoint['method'], number>;

const PARAMETER_LOCATION_SET: ReadonlySet<string> = new Set(PARAMETER_LOCATIONS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isParameterLocation(value: unknown): value is ParameterLocation {
  return typeof value === 'string' && PARAMETER_LOCATION_SET.has(value);
}

function getParameter(value: unknown): EndpointParameter | null {
  if (!isRecord(value) || typeof value.name !== 'string' || !isParameterLocation(value.in)) {
    return null;
  }

  return {
    name: value.name,
    in: value.in,
    required: value.required === true,
    description: typeof value.description === 'string' ? value.description : null,
  };
}

function getParameters(pathItem: Record<string, unknown>, operation: Record<string, unknown>): EndpointParameter[] {
  const pathParameters = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];

  const operationParameters = Array.isArray(operation.parameters) ? operation.parameters : [];

  const parameters = new Map<string, EndpointParameter>();

  for (const value of pathParameters) {
    const parameter = getParameter(value);

    if (parameter === null) {
      continue;
    }

    parameters.set(`${parameter.in}-${parameter.name}`, parameter);
  }

  for (const value of operationParameters) {
    const parameter = getParameter(value);

    if (parameter === null) {
      continue;
    }

    parameters.set(`${parameter.in}-${parameter.name}`, parameter);
  }

  return [...parameters.values()];
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
        parameters: getParameters(pathItem, operation),
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
