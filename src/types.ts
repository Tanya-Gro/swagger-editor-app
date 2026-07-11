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

export type HttpMethod = (typeof HTTP_METHODS)[number];

export type ParameterLocation = (typeof PARAMETER_LOCATIONS)[number];

export type EndpointParameter = {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required: boolean;
  description: string | null;
};

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type EndpointResponse = {
  status: string;
  description: string | null;
  example: JsonValue | null;
};

export type Endpoint = {
  path: string;
  method: HttpMethod;
  summary: string | null;
  tags: string[];
  parameters: EndpointParameter[];
  responses: EndpointResponse[];
};
