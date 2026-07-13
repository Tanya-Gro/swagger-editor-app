import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { schema } from '@tests/fixtures';

import { Card } from './Card';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import type { Endpoint, JsonValue } from '@/types';

vi.mock('./Parameters/Parameters', () => ({
  Parameters: function ParametersMock({
    parameters,
    body,
  }: {
    parameters: Endpoint['parameters'];
    body: JsonValue | null;
  }) {
    return (
      <div>
        <span>Parameters count: {parameters.length}</span>
        <span>Request body: {JSON.stringify(body)}</span>
      </div>
    );
  },
}));

vi.mock('./Responses/Responses', () => ({
  Responses: function ResponsesMock({ responses }: { responses: Endpoint['responses'] }) {
    return <div>Response statuses: {Object.keys(responses ?? {}).join(', ')}</div>;
  },
}));

vi.mock('@/views/History/HistoryTable/HistoryTable', () => ({
  MethodChip: function MethodChipMock({ method }: { method: string }) {
    return <span>{method}</span>;
  },
}));

const petEndpoint = getEndpoints(schema).find(({ pathname, method }) => pathname === '/pet' && method === 'post');

if (petEndpoint === undefined) {
  throw new Error('Petstore POST /pet endpoint was not found');
}

describe('Card', () => {
  it('renders endpoint method, pathname and summary', () => {
    render(<Card endpoint={petEndpoint} />);

    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/pet')).toBeInTheDocument();
    expect(screen.getByText('Add a new pet to the store.')).toBeInTheDocument();
  });

  it('renders parameters, request body and responses after expanding the accordion', async () => {
    const user = userEvent.setup();

    render(<Card endpoint={petEndpoint} />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Parameters count: 0')).toBeInTheDocument();
    expect(screen.getByText(/Request body:/)).toHaveTextContent('doggie');
    expect(screen.getByText('Response statuses: 200, 400, 422')).toBeInTheDocument();
  });

  it('renders an empty summary when summary is null', () => {
    const endpointWithoutSummary: Endpoint = {
      ...petEndpoint,
      summary: null,
    };

    const { container } = render(<Card endpoint={endpointWithoutSummary} />);

    expect(container.querySelector('p')).toBeEmptyDOMElement();
  });
});
