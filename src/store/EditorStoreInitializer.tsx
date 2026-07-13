'use client';

import { useEffect } from 'react';
import { useEditorStore } from './useEditorStore';
import type { EditorFormat } from '@/types';

type EditorStoreInitializerProps = {
  initialSchema: string;
  initialFormat: EditorFormat;
};

export function EditorStoreInitializer({ initialSchema, initialFormat }: EditorStoreInitializerProps) {
  useEffect(() => {
    if (initialSchema && useEditorStore.getState().schema === '' && !useEditorStore.getState().isHydrated) {
      useEditorStore.setState({
        schema: initialSchema,
        validSchema: initialSchema,
        format: initialFormat,
        isValid: true,
        errors: [],
        isHydrated: true,
      });
    } else {
      useEditorStore.setState({ isHydrated: true });
    }
  }, [initialSchema, initialFormat]);

  return null;
}
