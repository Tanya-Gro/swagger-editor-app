import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import messages from '@messages/en.json';
import { Viewer } from './Viewer';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import { useEditorStore } from '@/store/useEditorStore';
import type { Endpoint } from '@/types';

vi.mock('@/utils/viewer/getEndpoints', () => ({
  getEndpoints: vi.fn(),
}));

vi.mock('@/store/useEditorStore', () => ({
  useEditorStore: vi.fn(),
}));

vi.mock('@/components/Viewer/Card/Card', () => ({
  Card: function CardMock({ endpoint }: { endpoint: Endpoint }) {
    return (
      <div>
        {endpoint.method} {endpoint.pathname}
      </div>
    );
  },
}));

const mockedGetEndpoints = vi.mocked(getEndpoints);
const mockedUseEditorStore = vi.mocked(useEditorStore);

const schema = 'openapi: 3.0.0';

const endpoints: Endpoint[] = [
  {
    pathname: '/pet',
    method: 'post',
    summary: 'Add a new pet',
    tags: ['pet'],
    parameters: [],
    requestBody: null,
    requestBodyExample: null,
    responses: {},
  },
  {
    pathname: '/pet/{petId}',
    method: 'get',
    summary: 'Find pet by ID',
    tags: ['pet'],
    parameters: [],
    requestBody: null,
    requestBodyExample: null,
    responses: {},
  },
];

function renderViewer(): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <Viewer />
    </NextIntlClientProvider>,
  );
}

describe('Viewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseEditorStore.mockReturnValue(schema);
  });

  it('renders the viewer title', () => {
    mockedGetEndpoints.mockReturnValue([]);

    renderViewer();

    expect(
      screen.getByRole('heading', {
        name: 'Swagger UI',
      }),
    ).toBeInTheDocument();
  });

  it('passes valid schema to getEndpoints', () => {
    mockedGetEndpoints.mockReturnValue([]);

    renderViewer();

    expect(mockedGetEndpoints).toHaveBeenCalledWith(schema);
  });

  it('renders the empty state when there are no endpoints', () => {
    mockedGetEndpoints.mockReturnValue([]);

    renderViewer();

    expect(screen.getByText(messages.VIEWER.emptyMessage)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders a card for each endpoint', () => {
    mockedGetEndpoints.mockReturnValue(endpoints);

    renderViewer();

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(endpoints.length);

    expect(screen.getByText('post /pet')).toBeInTheDocument();
    expect(screen.getByText('get /pet/{petId}')).toBeInTheDocument();

    expect(screen.queryByText(messages.VIEWER.emptyMessage)).not.toBeInTheDocument();
  });
});
