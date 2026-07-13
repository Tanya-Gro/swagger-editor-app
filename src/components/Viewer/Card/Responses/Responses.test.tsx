import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { schema } from '@tests/fixtures';

import messages from '@messages/en.json';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import { Responses } from './Responses';

const petEndpoint = getEndpoints(schema).find(({ pathname, method }) => pathname === '/pet' && method === 'post');

if (petEndpoint === undefined) {
  throw new Error('Petstore POST /pet endpoint was not found');
}

const petResponses = petEndpoint.responses;

function renderResponses(responses: typeof petResponses): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <Responses responses={responses} />
    </NextIntlClientProvider>,
  );
}

describe('Responses', () => {
  it('renders title and all responses', () => {
    renderResponses(petResponses);

    expect(
      screen.getByRole('heading', {
        name: messages.VIEWER.response,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders statuses and descriptions as JSON', () => {
    renderResponses(petResponses);

    expect(screen.getByText(/"status": "200"/)).toBeInTheDocument();
    expect(screen.getByText(/"description": "Successful operation"/)).toBeInTheDocument();

    expect(screen.getByText(/"status": "400"/)).toBeInTheDocument();
    expect(screen.getByText(/"description": "Invalid input"/)).toBeInTheDocument();

    expect(screen.getByText(/"status": "422"/)).toBeInTheDocument();
    expect(screen.getByText(/"description": "Validation exception"/)).toBeInTheDocument();
  });

  it('does not render content when responses are empty', () => {
    renderResponses({});

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('does not render content when responses are undefined', () => {
    renderResponses(undefined);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
