import { z } from 'zod';

const swaggerDocumentSchema = z.record(z.string(), z.unknown());

export type SwaggerDocument = z.infer<typeof swaggerDocumentSchema>;

export function parseSwaggerDocument(input: unknown): SwaggerDocument {
  return swaggerDocumentSchema.parse(input);
}
