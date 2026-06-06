import { useCallback, useState } from 'react';
import { loadSwaggerDocument } from '@/services/service';
import type { SwaggerDocument } from '@/utils/parser';

type UseSwaggerResult = {
  document: SwaggerDocument | undefined;
  error: Error | undefined;
  isLoading: boolean;
  loadDocument: (url: string) => Promise<void>;
};

export function useSwagger(): UseSwaggerResult {
  const [document, setDocument] = useState<SwaggerDocument>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const loadDocument = useCallback(async (url: string): Promise<void> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const loadedDocument = await loadSwaggerDocument(url);

      setDocument(loadedDocument);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('Unknown Swagger loading error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    document,
    error,
    isLoading,
    loadDocument,
  };
}
