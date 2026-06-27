import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@messages/en.json';
import { Editor } from './Editor';

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea data-testid="editor" value={value} onChange={(event) => onChange(event.target.value)} />
  ),
}));

describe('Editor', () => {
  function renderEditor(): void {
    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        <Editor />
      </NextIntlClientProvider>,
    );
  }

  it('renders editor header', () => {
    renderEditor();

    expect(
      screen.getByRole('heading', {
        name: /swagger editor/i,
      }),
    ).toBeInTheDocument();
  });

  it('renders editor actions', () => {
    renderEditor();

    expect(
      screen.getByRole('button', {
        name: /json/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /yaml/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /clear/i,
      }),
    ).toBeInTheDocument();
  });

  it('uses JSON format by default', () => {
    renderEditor();

    expect(
      screen.getByRole('button', {
        name: 'JSON',
      }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('updates schema on input', () => {
    renderEditor();

    const editor = screen.getByTestId('editor');

    fireEvent.change(editor, {
      target: {
        value: '{"openapi":"3.0.0"}',
      },
    });

    expect(editor).toHaveValue('{"openapi":"3.0.0"}');
  });

  it('clears schema after clicking Clear', () => {
    renderEditor();

    const editor = screen.getByTestId('editor');

    fireEvent.change(editor, {
      target: {
        value: 'test schema',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /clear/i,
      }),
    );

    expect(editor).toHaveValue('');
  });

  it('shows current format as selected and toggle buttons', () => {
    renderEditor();

    const yamlButton = screen.getByRole('button', { name: 'YAML' });
    const jsonButton = screen.getByRole('button', { name: 'JSON' });

    expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
    expect(yamlButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(yamlButton);

    expect(jsonButton).toHaveAttribute('aria-pressed', 'false');
    expect(yamlButton).toHaveAttribute('aria-pressed', 'true');
  });
});
