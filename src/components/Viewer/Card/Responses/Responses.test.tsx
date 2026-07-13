import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, beforeEach } from 'vitest';
import { schema } from '@tests/fixtures';

import messages from '@messages/en.json';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import { Responses } from './Responses';
import { useViewerStore, getEndpointKey, type ProxyResponseData } from '@/store/useViewerStore';
import type { HttpMethod } from '@/types';

const petEndpoint = getEndpoints(schema).find(({ pathname, method }) => pathname === '/pet' && method === 'post');

if (petEndpoint === undefined) {
  throw new Error('Petstore POST /pet endpoint was not found');
}

const petResponses = petEndpoint.responses;
const testMethod: HttpMethod = 'post';
const testPathname = '/pet';

function renderResponses(responses: typeof petResponses): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <Responses responses={responses} method={testMethod} pathname={testPathname} />
    </NextIntlClientProvider>,
  );
}

describe('Responses', () => {
  beforeEach((): void => {
    useViewerStore.setState({ executeResults: {} });
  });

  it('renders title and all responses', (): void => {
    renderResponses(petResponses);

    expect(
      screen.getByRole('heading', {
        name: messages.VIEWER.response,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders statuses and descriptions as JSON', (): void => {
    renderResponses(petResponses);

    expect(screen.getByText(/"status": "200"/)).toBeInTheDocument();
    expect(screen.getByText(/"description": "Successful operation"/)).toBeInTheDocument();

    expect(screen.getByText(/"status": "400"/)).toBeInTheDocument();
    expect(screen.getByText(/"description": "Invalid input"/)).toBeInTheDocument();

    expect(screen.getByText(/"status": "422"/)).toBeInTheDocument();
    expect(screen.getByText(/"description": "Validation exception"/)).toBeInTheDocument();
  });

  it('does not render content when responses are empty', (): void => {
    renderResponses({});

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('does not render content when responses are undefined', (): void => {
    renderResponses(undefined);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders live execution result from store with metrics and raw string body', (): void => {
    const mockKey = getEndpointKey(testMethod, testPathname);
    const mockResult: ProxyResponseData = {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      body: '{"id": 123, "name": "Jack"}',
      metrics: {
        requestTimeIso: '2026-03-30T12:00:00.000Z',
        responseTimeIso: '2026-03-30T12:00:00.150Z',
        durationMs: 150,
      },
    };

    useViewerStore.setState({
      executeResults: {
        [mockKey]: mockResult,
      },
    });

    renderResponses(petResponses);

    expect(
      screen.getByRole('heading', {
        name: messages.VIEWER.executeResponseTitle,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/150\s*ms/)).toBeInTheDocument();

    expect(screen.getByText(/"status": 201/)).toBeInTheDocument();
    expect(screen.getByText(/"statusText": "Created"/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "Jack"/)).toBeInTheDocument();
  });
});
