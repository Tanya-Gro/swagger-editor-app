import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import messages from '@messages/en.json';
import { schema } from '@tests/fixtures';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import { Parameters } from './Parameters';

const endpoints = getEndpoints(schema);

const postPetEndpoint = endpoints.find(({ pathname, method }) => pathname === '/pet' && method === 'post');

const deletePetEndpoint = endpoints.find(({ pathname, method }) => pathname === '/pet/{petId}' && method === 'delete');

if (postPetEndpoint === undefined || deletePetEndpoint === undefined) {
  throw new Error('Required Petstore endpoints were not found');
}

const requestBody = postPetEndpoint.requestBodyExample;
const parameters = deletePetEndpoint.parameters;

function renderParameters(componentParameters = parameters, body = requestBody): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <Parameters parameters={componentParameters} body={body} />
    </NextIntlClientProvider>,
  );
}

function getRequestBodyInput(): HTMLTextAreaElement {
  const input = document.querySelector<HTMLTextAreaElement>('textarea[name="requestBody"]');

  if (input === null) {
    throw new Error('Request body input was not found');
  }

  return input;
}

describe('Parameters', () => {
  it('renders parameters and request body in read-only mode', () => {
    renderParameters();

    expect(
      screen.getByRole('heading', {
        name: messages.VIEWER.parameters,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText('api_key')).toBeDisabled();
    expect(screen.getByLabelText(/petId/)).toBeDisabled();
    expect(screen.getByLabelText(/petId/)).toBeRequired();

    const bodyInput = getRequestBodyInput();

    expect(bodyInput).toHaveValue(JSON.stringify(requestBody, null, 2));
    expect(bodyInput).toHaveAttribute('readonly');

    expect(
      screen.getByRole('button', {
        name: messages.VIEWER.tryAction,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', {
        name: messages.VIEWER.executeAction,
      }),
    ).not.toBeInTheDocument();
  });

  it('enables editing after clicking Try it out', async () => {
    const user = userEvent.setup();

    renderParameters();

    await user.click(
      screen.getByRole('button', {
        name: messages.VIEWER.tryAction,
      }),
    );

    expect(screen.getByLabelText('api_key')).toBeEnabled();
    expect(screen.getByLabelText(/petId/)).toBeEnabled();

    const bodyInput = getRequestBodyInput();

    expect(bodyInput).not.toHaveAttribute('readonly');

    expect(
      screen.getByRole('button', {
        name: messages.VIEWER.cancelAction,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: messages.VIEWER.executeAction,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'cURL',
      }),
    ).toBeInTheDocument();
  });

  it('restores request body after cancelling', async () => {
    const user = userEvent.setup();

    renderParameters();

    await user.click(
      screen.getByRole('button', {
        name: messages.VIEWER.tryAction,
      }),
    );

    const bodyInput = getRequestBodyInput();

    await user.clear(bodyInput);
    await user.click(bodyInput);
    await user.paste('{"name":"updated pet"}');

    expect(bodyInput).toHaveValue('{"name":"updated pet"}');

    await user.click(
      screen.getByRole('button', {
        name: messages.VIEWER.cancelAction,
      }),
    );

    expect(bodyInput).toHaveValue(JSON.stringify(requestBody, null, 2));
    expect(bodyInput).toHaveAttribute('readonly');

    expect(
      screen.queryByRole('button', {
        name: messages.VIEWER.executeAction,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders empty messages when parameters and body are absent', () => {
    renderParameters([], null);

    expect(screen.getByText(messages.VIEWER.noParametersMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.VIEWER.noBodyMessage)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
