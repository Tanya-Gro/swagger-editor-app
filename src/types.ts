import { type HTTP_METHODS, type PARAMETER_LOCATIONS } from './constants';

export type EditorFormat = 'JSON' | 'YAML' | 'unknown';

export type ValidationErrorsLogin = {
  email?: string;
  password?: string;
};

export type UserDataLogin = {
  email: string;
  password: string;
};

export type ValidationResultLogin = {
  data: UserDataLogin | null;
  errors: ValidationErrorsLogin | null;
};

export type TranslationFn = (key: string, values?: Record<string, string | number | Date>) => string;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type SwaggerDocument = {
  openapi?: string;
  swagger?: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, PathItem>;
};

export type PathItem = Partial<Record<HttpMethod, SwaggerOperation>>;

export type SwaggerOperation = {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: EndpointParameter[];
  responses?: Record<string, unknown>;
};

export type SwaggerResponse = {
  description?: string;
  content?: Record<string, unknown>;
  examples?: Record<string, unknown>;
  schema?: unknown;
  $ref?: string;
};

export type HttpMethod = (typeof HTTP_METHODS)[number];

export type ParameterLocation = (typeof PARAMETER_LOCATIONS)[number];

export type EndpointParameter = {
  name: string;
  in: ParameterLocation;
  required: boolean;
  description: string | null;
};

export type EndpointResponse = {
  status: string;
  description: string | null;
  example: JsonValue | null;
};

export type Endpoint = {
  pathname: string;
  method: HttpMethod;
  summary: string | null;
  tags: string[];
  parameters: EndpointParameter[];
  responses: Record<string, unknown> | undefined;
};
