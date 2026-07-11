import { parse } from 'yaml';
import SwaggerParser from '@apidevtools/swagger-parser';
import { type OpenAPI } from 'openapi-types';

import {
  type Endpoint,
  type ParameterLocation,
  type EndpointParameter,
  type EndpointResponse,
  type JsonValue,
} from '@/types';
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

function isOpenApiDocument(value: unknown): value is OpenAPI.Document {
  if (!isRecord(value) || !isRecord(value.info) || !isRecord(value.paths)) {
    return false;
  }

  return typeof value.openapi === 'string' || value.swagger === '2.0';
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

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(isJsonValue);
}

function getExampleFromSchema(schema: unknown): JsonValue | null {
  if (!isRecord(schema)) {
    return null;
  }

  if (isJsonValue(schema.example)) {
    return schema.example;
  }

  if (isJsonValue(schema.default)) {
    return schema.default;
  }

  if (Array.isArray(schema.enum) && isJsonValue(schema.enum[0])) {
    return schema.enum[0];
  }

  if (Array.isArray(schema.allOf)) {
    const result: Record<string, JsonValue> = {};

    for (const item of schema.allOf) {
      const itemExample = getExampleFromSchema(item);

      if (isRecord(itemExample)) {
        for (const [key, value] of Object.entries(itemExample)) {
          if (isJsonValue(value)) {
            result[key] = value;
          }
        }
      }
    }

    return result;
  }

  if (isRecord(schema.properties)) {
    const result: Record<string, JsonValue> = {};

    for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
      const propertyExample = getExampleFromSchema(propertySchema);

      if (propertyExample !== null) {
        result[propertyName] = propertyExample;
      }
    }

    return result;
  }

  if (schema.type === 'array') {
    const itemExample = getExampleFromSchema(schema.items);

    return itemExample === null ? [] : [itemExample];
  }

  if (schema.type === 'integer' || schema.type === 'number') {
    return 0;
  }

  if (schema.type === 'boolean') {
    return false;
  }

  if (schema.type === 'string') {
    return 'string';
  }

  return null;
}

function getFirstNamedExample(examples: unknown): JsonValue | null {
  if (!isRecord(examples)) {
    return null;
  }

  for (const exampleObject of Object.values(examples)) {
    if (!isRecord(exampleObject)) {
      continue;
    }

    if (isJsonValue(exampleObject.value)) {
      return exampleObject.value;
    }
  }

  return null;
}

function getJsonMediaType(content: Record<string, unknown>): Record<string, unknown> | null {
  for (const [mediaType, mediaTypeObject] of Object.entries(content)) {
    const isJson = mediaType === 'application/json' || mediaType.endsWith('+json');

    if (isJson && isRecord(mediaTypeObject)) {
      return mediaTypeObject;
    }
  }

  return null;
}

function getResponseExample(response: Record<string, unknown>): JsonValue | null {
  if (isRecord(response.schema)) {
    return getExampleFromSchema(response.schema);
  }

  if (!isRecord(response.content)) {
    return null;
  }

  const mediaTypeObject = getJsonMediaType(response.content);

  if (mediaTypeObject === null) {
    return null;
  }

  if (isJsonValue(mediaTypeObject.example)) {
    return mediaTypeObject.example;
  }

  const namedExample = getFirstNamedExample(mediaTypeObject.examples);

  if (namedExample !== null) {
    return namedExample;
  }

  if (!isRecord(mediaTypeObject.schema)) {
    return null;
  }

  return getExampleFromSchema(mediaTypeObject.schema);
}

function getResponses(operation: Record<string, unknown>): EndpointResponse[] {
  if (!isRecord(operation.responses)) {
    return [];
  }

  const responses: EndpointResponse[] = [];

  for (const [status, response] of Object.entries(operation.responses)) {
    if (!isRecord(response)) {
      continue;
    }

    responses.push({ status, example: getResponseExample(response) });
  }

  return responses.toSorted((firstResponse, secondResponse) => {
    if (firstResponse.status === 'default') {
      return 1;
    }

    if (secondResponse.status === 'default') {
      return -1;
    }

    return firstResponse.status.localeCompare(secondResponse.status, undefined, { numeric: true });
  });
}

function getPathGroup(path: string): string {
  return path.split('/').find(Boolean) ?? '';
}

function getEndpointGroup(endpoint: Endpoint): string {
  return endpoint.tags[0] ?? getPathGroup(endpoint.path);
}

export const getEndpoints = async (schema: string): Promise<Endpoint[]> => {
  const parsedSchema: unknown = parse(schema);

  if (!isOpenApiDocument(parsedSchema)) {
    return [];
  }

  const dereferencedSchema: unknown = await SwaggerParser.dereference(parsedSchema);

  if (!isRecord(dereferencedSchema) || !isRecord(dereferencedSchema.paths)) {
    return [];
  }

  const endpoints: Endpoint[] = [];

  for (const [path, pathItem] of Object.entries(dereferencedSchema.paths)) {
    if (!isRecord(pathItem)) {
      continue;
    }

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];

      if (!isRecord(operation)) {
        continue;
      }

      const summary = typeof operation.summary === 'string' ? operation.summary : null;

      const tags = Array.isArray(operation.tags)
        ? operation.tags.filter((tag): tag is string => typeof tag === 'string')
        : [];

      endpoints.push({
        path,
        method,
        summary,
        tags,
        parameters: getParameters(pathItem, operation),
        responses: getResponses(operation),
      });
    }
  }

  return endpoints.toSorted((firstEndpoint, secondEndpoint) => {
    const groupComparison = getEndpointGroup(firstEndpoint).localeCompare(getEndpointGroup(secondEndpoint));

    if (groupComparison !== 0) {
      return groupComparison;
    }

    const methodComparison = HTTP_METHOD_ORDER[firstEndpoint.method] - HTTP_METHOD_ORDER[secondEndpoint.method];

    if (methodComparison !== 0) {
      return methodComparison;
    }

    return firstEndpoint.path.localeCompare(secondEndpoint.path);
  });
};
