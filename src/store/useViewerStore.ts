import { create } from 'zustand';

export type ProxyResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  metrics: {
    requestTimeIso: string;
    responseTimeIso: string;
    durationMs: number;
  };
};

type ViewerState = {
  openForms: Record<string, boolean>;
  executeResults: Record<string, ProxyResponseData | null>;
  setFormOpen: (method: string, pathname: string, isOpen: boolean) => void;
  setExecuteResult: (method: string, pathname: string, result: ProxyResponseData | null) => void;
  resetEndpoint: (method: string, pathname: string) => void;
};

export const getEndpointKey = (method: string, pathname: string): string => `${method.toUpperCase()}-${pathname}`;

export const useViewerStore = create<ViewerState>((set) => ({
  openForms: {},
  executeResults: {},

  setFormOpen: (method: string, pathname: string, isOpen: boolean): void =>
    set((state: ViewerState) => ({
      openForms: {
        ...state.openForms,
        [getEndpointKey(method, pathname)]: isOpen,
      },
    })),

  setExecuteResult: (method: string, pathname: string, result: ProxyResponseData | null): void =>
    set((state: ViewerState) => ({
      executeResults: {
        ...state.executeResults,
        [getEndpointKey(method, pathname)]: result,
      },
    })),

  resetEndpoint: (method: string, pathname: string): void =>
    set((state: ViewerState) => ({
      openForms: {
        ...state.openForms,
        [getEndpointKey(method, pathname)]: false,
      },
      executeResults: {
        ...state.executeResults,
        [getEndpointKey(method, pathname)]: null,
      },
    })),
}));
