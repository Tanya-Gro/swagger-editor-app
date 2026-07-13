import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import messages from '@messages/en.json';
import { Home } from './Home';
import { serverClient } from '@/database/server-client';
import { getSchema } from '@/utils/editor/schemaService/schemaService';
import type { EditorFormat } from '@/types';

type ResolvedSupabaseClient = Awaited<ReturnType<typeof serverClient>>;

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
});

vi.mock('@/database/server-client', () => ({
  serverClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      },
    }),
  ),
}));

vi.mock('@/utils/editor/schemaService/schemaService', () => ({
  getSchema: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: () => <textarea data-testid="editor-mock" />,
}));

vi.mock('@/store/EditorStoreInitializer', () => ({
  EditorStoreInitializer: ({
    initialSchema,
    initialFormat,
  }: {
    initialSchema: string;
    initialFormat: EditorFormat;
  }) => <div data-testid="store-initializer" data-schema={initialSchema} data-format={initialFormat} />,
}));

describe('Home Component Integration', () => {
  it('renders editor and viewer panel safely', async () => {
    const HomeResolved = await Home();

    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        {HomeResolved}
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole('heading', {
        name: /swagger editor/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /swagger ui/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render default empty layout when user is not authenticated', async () => {
    vi.mocked(serverClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      },
    } as unknown as ResolvedSupabaseClient);

    const HomeResolved = await Home();
    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        {HomeResolved}
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole('heading', { name: /swagger editor/i })).toBeInTheDocument();
    expect(screen.getByText(/swagger ui/i)).toBeInTheDocument();

    const initializer = screen.getByTestId('store-initializer');
    expect(initializer).toHaveAttribute('data-schema', '');
    expect(initializer).toHaveAttribute('data-format', 'JSON');

    expect(getSchema).not.toHaveBeenCalled();
  });

  it('should render default layout when user is authenticated but has no schema in DB', async () => {
    vi.mocked(serverClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-123' } }, error: null })),
      },
    } as unknown as ResolvedSupabaseClient);
    vi.mocked(getSchema).mockResolvedValue(null);

    const HomeResolved = await Home();
    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        {HomeResolved}
      </NextIntlClientProvider>,
    );

    expect(getSchema).toHaveBeenCalledTimes(1);

    const initializer = screen.getByTestId('store-initializer');
    expect(initializer).toHaveAttribute('data-schema', '');
    expect(initializer).toHaveAttribute('data-format', 'JSON');
  });

  it('should successfully pass schema and format to initializer when record exists in DB', async () => {
    const mockDbData = {
      schema: 'openapi: 3.0.0\ninfo:\n  title: Saved YAML API',
      format: 'YAML' as const,
    };

    vi.mocked(serverClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-123' } }, error: null })),
      },
    } as unknown as ResolvedSupabaseClient);
    vi.mocked(getSchema).mockResolvedValue(mockDbData);

    const HomeResolved = await Home();
    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        {HomeResolved}
      </NextIntlClientProvider>,
    );

    expect(getSchema).toHaveBeenCalledTimes(1);

    const initializer = screen.getByTestId('store-initializer');
    expect(initializer).toHaveAttribute('data-schema', mockDbData.schema);
    expect(initializer).toHaveAttribute('data-format', 'YAML');
  });
});
