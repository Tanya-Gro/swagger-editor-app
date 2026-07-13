import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { EditorActions } from './EditorActions';
import { toast } from '@/utils/toast/toast';
import { type EditorFormat } from '@/types';
import { useEditorStore } from '@/store/useEditorStore';
import messages from '@messages/en.json';

vi.mock('@/utils/toast/toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/store/useEditorStore', () => ({
  useEditorStore: vi.fn(),
}));

vi.mock('@/utils/editor/convertFormat/convertFormat', () => ({
  yamlToJson: vi.fn((str: string) => `converted-json-of-${str}`),
  jsonToYaml: vi.fn((str: string) => `converted-yaml-of-${str}`),
}));

describe('EditorActions', () => {
  const mockSetSchema = vi.fn();
  const mockSetFormat = vi.fn();

  function setupStoreMock(format: EditorFormat = 'JSON', schema = '') {
    vi.mocked(useEditorStore).mockImplementation((selector) =>
      selector({
        format,
        schema,
        setFormat: mockSetFormat,
        updateSchema: mockSetSchema,
        validSchema: '',
        errors: [],
        isValid: true,
        isValidating: false,
        isHydrated: true,
        saveStatus: 'idle',
        validationGeneration: 0,
        debounceTimeoutId: null,
        saveTimeoutId: null,
        clearErrors: vi.fn(),
      }),
    );
  }

  beforeEach(() => {
    setupStoreMock();
  });

  function renderEditorActions(): void {
    render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        <EditorActions />
      </NextIntlClientProvider>,
    );
  }

  it('calls setFormat and mockSetSchema when YAML selected', () => {
    setupStoreMock('JSON', 'openapi: 3.0.0');
    renderEditorActions();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'YAML',
      }),
    );

    expect(mockSetSchema).toHaveBeenCalledWith('converted-yaml-of-openapi: 3.0.0');
    expect(mockSetFormat).toHaveBeenCalledWith('YAML');
  });

  it('calls mockSetSchema with empty string on Clear button click', () => {
    renderEditorActions();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear',
      }),
    );

    expect(mockSetSchema).toHaveBeenCalledTimes(1);
    expect(mockSetSchema).toHaveBeenCalledWith('');
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

  it('does not call setFormat if the active format button is clicked again', () => {
    setupStoreMock('JSON');
    renderEditorActions();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'JSON',
      }),
    );

    expect(mockSetFormat).not.toHaveBeenCalled();
  });

  it('triggers file input click on Load button click', () => {
    renderEditorActions();

    const fileInput = screen.getByTestId('file-input');
    const clickSpy = vi.spyOn(fileInput, 'click');

    fireEvent.click(screen.getByRole('button', { name: /load/i }));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows error toast if file is too large', () => {
    renderEditorActions();

    const fileInput = screen.getByTestId('file-input');
    const largeFile = new File(['a'.repeat(3 * 1024 * 1024)], 'large.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(toast.error).toHaveBeenCalledWith(messages.EDITOR.notifications.fileTooLarge);
    expect(fileInput).toHaveValue('');
  });

  it('shows error toast if file format is invalid', () => {
    renderEditorActions();

    const fileInput = screen.getByTestId('file-input');
    const invalidFile = new File(['hello'], 'image.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('image.png'));
    expect(fileInput).toHaveValue('');
  });

  it('reads JSON file successfully and changes schema and active format tab', async () => {
    setupStoreMock('YAML');
    renderEditorActions();

    const fileInput = screen.getByTestId('file-input');
    const validFile = new File(['{"test": true}'], 'schema.json', { type: 'application/json' });

    vi.spyOn(File.prototype, 'text').mockResolvedValue('{"test": true}');

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(mockSetSchema).toHaveBeenCalledWith('{"test": true}');
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('schema.json'));
    });
  });

  it('reads YAML file successfully and changes schema and active format tab', async () => {
    setupStoreMock('JSON');
    renderEditorActions();

    const fileInput = screen.getByTestId('file-input');
    const validFile = new File(['test: true'], 'schema.yaml', { type: 'text/yaml' });

    vi.spyOn(File.prototype, 'text').mockResolvedValue('test: true');

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(mockSetSchema).toHaveBeenCalledWith('test: true');
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('schema.yaml'));
    });
  });

  it('does nothing if no file is selected', () => {
    renderEditorActions();

    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [] } });

    expect(mockSetSchema).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('shows error toast when file reading fails', async () => {
    renderEditorActions();

    const fileInput = screen.getByTestId('file-input');
    const validFile = new File(['{}'], 'broken.json', { type: 'application/json' });

    vi.spyOn(File.prototype, 'text').mockRejectedValue(new Error('Read error'));

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(messages.EDITOR.notifications.loadingError);
      expect(fileInput).toHaveValue('');
    });
  });
});
