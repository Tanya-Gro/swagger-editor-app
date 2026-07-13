export type EditorFormat = 'JSON' | 'YAML' | 'unknown';

export type ValidationErrorsLogin = {
  email?: string;
  password?: string;
};

export type ValidationErrorsRegistration = {
  email?: string;
  password?: string;
  repeatPassword?: string;
};

export type UserDataLogin = {
  email: string;
  password: string;
};

export type UserDataRegistration = {
  email: string;
  password: string;
  repeatPassword: string;
};

export type TranslationFn = (key: string, values?: Record<string, string | number | Date>) => string;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type SwaggerSchema = Record<string, unknown>;

export type MediaTypeObject = {
  schema?: SwaggerSchema;
  example?: unknown;
};

export const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

export const PARAMETER_LOCATIONS = ['path', 'query', 'header', 'cookie'] as const;

export type SwaggerDocument = {
  openapi?: string;
  swagger?: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, SwaggerSchema>;
  };
  definitions?: Record<string, SwaggerSchema>;
};

export type PathItem = Partial<Record<HttpMethod, SwaggerOperation>>;

export type SwaggerOperation = {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: SwaggerParameter[];
  responses?: Record<string, unknown>;
  requestBody?: RequestBody;
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

export type SwaggerParameter = {
  name: string;
  in: ParameterLocation;
  required?: boolean;
  description: string | null;
  schema?: {
    type?: string;
    example?: unknown;
  };
};

export type RequestBody = {
  required?: boolean;
  content?: Record<string, MediaTypeObject>;
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
  parameters: SwaggerParameter[];
  requestBody: RequestBody | null;
  requestBodyExample: JsonValue | null;
  responses: Record<string, unknown> | undefined;
};

export type ValidationError = {
  path: string;
  message: string;
};

export type SchemaSaveResult = { success: boolean; error?: string };
