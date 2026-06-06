import { parseSwaggerDocument, type SwaggerDocument } from '@/utils/parser';

export async function loadSwaggerDocument(url: string): Promise<SwaggerDocument> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load Swagger document: ${response.statusText}`);
  }

  const data: unknown = await response.json();

  return parseSwaggerDocument(data);
}
