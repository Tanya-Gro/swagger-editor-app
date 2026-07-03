import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@messages/en.json';
import { EditorActions } from './EditorActions';

describe('EditorActions', () => {
  const onChangeFormat = vi.fn();
  const onChangeSchema = vi.fn();

  function renderEditorActions(): void {
    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        <EditorActions format="JSON" onChangeFormat={onChangeFormat} onChangeSchema={onChangeSchema} />
      </NextIntlClientProvider>,
    );
  }

  it('calls onChangeFormat when YAML selected', () => {
    renderEditorActions();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'YAML',
      }),
    );

    expect(onChangeFormat).toHaveBeenCalledWith('YAML');
  });

  it('calls onClear', () => {
    renderEditorActions();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear',
      }),
    );

    expect(onChangeSchema).toHaveBeenCalledTimes(1);
  });

  it('renders action buttons', () => {
    renderEditorActions();

    expect(
      screen.getByRole('button', {
        name: /clear/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /load/i,
      }),
    ).toBeInTheDocument();
  });
});
