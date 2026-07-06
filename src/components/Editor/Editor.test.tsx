import { act, fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '@messages/en.json';
import { Editor } from './Editor';
import { detectFormat } from '@/utils/editor/detectFormat/detectFormat';
import { jsonToYaml } from '@/utils/editor/convertFormat/convertFormat';

import { toast } from '@/utils/toast/toast';

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea data-testid="editor" value={value} onChange={(event) => onChange(event.target.value)} />
  ),
}));

vi.mock('@/utils/editor/convertFormat/convertFormat', () => ({
  jsonToYaml: vi.fn(),
  yamlToJson: vi.fn(),
}));

vi.mock('@/utils/editor/detectFormat/detectFormat', () => ({
  detectFormat: vi.fn(),
}));

vi.mock('@/utils/toast/toast', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
  },
}));

const AUTO_DETECT_DELAY = 500;

describe('Editor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

  it('should auto-detect unknown format after delay and show error toast', () => {
    vi.mocked(detectFormat).mockImplementation(() => 'unknown');
    renderEditor();

    const editor = screen.getByTestId('editor');
    fireEvent.change(editor, { target: { value: 'broken content' } });

    expect(toast.error).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(AUTO_DETECT_DELAY);
    });

    expect(detectFormat).toHaveBeenCalledWith('broken content');
    expect(toast.error).toHaveBeenCalledWith(messages.EDITOR.notifications.unsupportedFormat);
  });

  it('should block conversion and show warning if format is unknown', () => {
    vi.mocked(detectFormat).mockImplementation(() => 'unknown');
    renderEditor();

    const editor = screen.getByTestId('editor');
    fireEvent.change(editor, { target: { value: 'invalid format data' } });

    act(() => {
      vi.advanceTimersByTime(AUTO_DETECT_DELAY);
    });

    const yamlButton = screen.getByRole('button', { name: 'YAML' });
    fireEvent.click(yamlButton);

    expect(toast.warning).toHaveBeenCalledWith(messages.EDITOR.notifications.conversionDisabled);
    expect(jsonToYaml).not.toHaveBeenCalled();
  });

  it('should catch error during conversion and show error toast with the key message', () => {
    vi.mocked(detectFormat).mockImplementation(() => 'JSON');
    vi.mocked(jsonToYaml).mockImplementation(() => {
      throw new Error('notifications.jsonToYaml');
    });

    renderEditor();
    const editor = screen.getByTestId('editor');

    fireEvent.change(editor, { target: { value: '{"name": "test"}' } });
    act(() => {
      vi.advanceTimersByTime(AUTO_DETECT_DELAY);
    });

    const yamlButton = screen.getByRole('button', { name: 'YAML' });
    fireEvent.click(yamlButton);

    expect(toast.error).toHaveBeenCalledWith(messages.EDITOR.notifications.jsonToYaml);
  });

  it('should return empty extension array and render safely when format is unknown', () => {
    vi.mocked(detectFormat).mockImplementation(() => 'unknown');
    renderEditor();

    const editor = screen.getByTestId('editor');
    fireEvent.change(editor, { target: { value: '!!!' } });

    act(() => {
      vi.advanceTimersByTime(AUTO_DETECT_DELAY);
    });

    expect(editor).toBeInTheDocument();
  });
});
