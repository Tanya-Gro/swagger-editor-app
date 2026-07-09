import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Editor } from './Editor';
import { useEditorStore, type ValidationError } from '@/store/useEditorStore';
import { type EditorFormat } from '@/types';
import messages from '@messages/en.json';

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea data-testid="editor" value={value} onChange={(event) => onChange(event.target.value)} />
  ),
}));

vi.mock('@/store/useEditorStore', () => ({
  useEditorStore: vi.fn(),
}));

describe('Editor', () => {
  const mockUpdateSchema = vi.fn();
  const mockSetFormat = vi.fn();

  function setupStoreMock(format: EditorFormat = 'JSON', schema = '', errors: ValidationError[] = []) {
    vi.mocked(useEditorStore).mockImplementation((selector) =>
      selector({
        format,
        schema,
        errors,
        setFormat: mockSetFormat,
        updateSchema: mockUpdateSchema,
        validSchema: '',
        isValid: errors.length === 0,
        isValidating: false,
        debounceTimeoutId: null,
        clearErrors: vi.fn(),
      }),
    );
  }

  beforeEach(() => {
    setupStoreMock();
  });

  function renderEditor(): void {
    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        <Editor />
      </NextIntlClientProvider>,
    );
  }

  it('should render editor header', () => {
    renderEditor();

    expect(
      screen.getByRole('heading', {
        name: /swagger editor/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render editor actions toolbar', () => {
    renderEditor();

    expect(screen.getByRole('button', { name: /json/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yaml/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('should set the active format button based on store state', () => {
    setupStoreMock('JSON');
    renderEditor();

    expect(screen.getByRole('button', { name: 'JSON' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'YAML' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should fire store updateSchema action on textarea value changes', () => {
    renderEditor();

    const editor = screen.getByTestId('editor');

    fireEvent.change(editor, {
      target: {
        value: '{"openapi":"3.0.0"}',
      },
    });

    expect(mockUpdateSchema).toHaveBeenCalledWith('{"openapi":"3.0.0"}');
  });

  it('should display the error list panel below CodeMirror if errors are present in the store', () => {
    const mockErrors = [{ path: 'info.title', message: 'must be string' }];
    setupStoreMock('JSON', '{"info": {"title": 123}}', mockErrors);

    renderEditor();

    const errorPanel = screen.getByTestId('error-list');
    expect(errorPanel).toBeInTheDocument();
    expect(screen.getByText('info.title:')).toBeInTheDocument();
    expect(screen.getByText('must be string')).toBeInTheDocument();
  });

  it('should safely render without error panels when there are no errors', () => {
    setupStoreMock('JSON', '{"openapi":"3.0.0"}', []);
    renderEditor();

    expect(screen.queryByTestId('error-list')).not.toBeInTheDocument();
  });

  it('should pass an empty extension array to CodeMirror safely if store format is unknown', () => {
    setupStoreMock('unknown', '!!! broken schema !!!');
    renderEditor();

    const editor = screen.getByTestId('editor');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveValue('!!! broken schema !!!');
    expect(screen.getByRole('button', { name: 'JSON' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'YAML' })).toHaveAttribute('aria-pressed', 'false');
  });
});
