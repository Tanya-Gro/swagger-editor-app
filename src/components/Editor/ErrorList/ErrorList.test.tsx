import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { ErrorList } from './ErrorList';
import { useEditorStore } from '@/store/useEditorStore';
import type { EditorFormat, ValidationError } from '@/types';
import messages from '@messages/en.json';

vi.mock('@/store/useEditorStore', () => ({
  useEditorStore: vi.fn(),
}));

vi.mock('@/app/loading', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

function setupStoreMock({
  format = 'JSON' as EditorFormat,
  schema = 'openapi: 3.0.0',
  validSchema = 'openapi: 3.0.0',
  errors = [] as ValidationError[],
  isValid = true,
  isValidating = false,
  isHydrated = true,
}) {
  vi.mocked(useEditorStore).mockImplementation((selector) =>
    selector({
      format,
      schema,
      validSchema,
      errors,
      isValid,
      isValidating,
      isHydrated,
      saveStatus: 'idle',
      debounceTimeoutId: null,
      validationGeneration: 0,
      saveTimeoutId: null,
      setFormat: vi.fn(),
      updateSchema: vi.fn(),
      clearErrors: vi.fn(),
    }),
  );
}

describe('ErrorList Component', () => {
  function renderErrorList() {
    return render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        <ErrorList />
      </NextIntlClientProvider>,
    );
  }

  it('should render nothing if the errors array is empty', () => {
    setupStoreMock({ isValid: true, errors: [] });
    const { container } = renderErrorList();
    expect(container.firstChild).toBeNull();
  });

  it('should render the loading spinner while validation is in progress', () => {
    setupStoreMock({
      isValid: false,
      isValidating: true,
      isHydrated: true,
      schema: 'openapi: 3.0.0',
    });

    renderErrorList();

    const loader = screen.getByTestId('loading-spinner');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveTextContent('Loading...');
  });

  it('should display error paths and messages correctly', () => {
    const mockErrors: ValidationError[] = [
      { path: 'info.version', message: 'must be a string' },
      { path: 'paths./users', message: 'must be an object' },
    ];
    setupStoreMock({ isValid: false, errors: mockErrors });

    renderErrorList();

    const firstPath = screen.getByText('info.version:');
    const secondPath = screen.getByText('paths./users:');

    expect(firstPath).toBeInTheDocument();
    expect(firstPath.tagName).toBe('STRONG');
    expect(screen.getByText('must be a string')).toBeInTheDocument();

    expect(secondPath).toBeInTheDocument();
    expect(secondPath.tagName).toBe('STRONG');
    expect(screen.getByText('must be an object')).toBeInTheDocument();
  });

  it('should render raw error messages if they are not translation keys', () => {
    const mockErrors: ValidationError[] = [{ path: 'info.title', message: 'Raw error from swagger parser' }];
    setupStoreMock({ isValid: false, errors: mockErrors });
    renderErrorList();

    expect(screen.getByText('info.title:')).toBeInTheDocument();
    expect(screen.getByText('Raw error from swagger parser')).toBeInTheDocument();
  });

  it('should render the header with the correct count of errors', () => {
    const mockErrors: ValidationError[] = [
      { path: 'info', message: 'Missing property' },
      { path: 'paths', message: 'Should be an object' },
    ];
    setupStoreMock({ isValid: false, errors: mockErrors });

    renderErrorList();

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Specification errors (2):');
  });

  it('should correctly resolve and render localized message when it is a translation key', () => {
    const mockErrors: ValidationError[] = [{ path: 'root', message: 'notifications.invalidObject' }];
    setupStoreMock({ isValid: false, errors: mockErrors });

    renderErrorList();

    expect(screen.getByText('root:')).toBeInTheDocument();
    expect(screen.getByText('Schema must be a valid JSON/YAML object')).toBeInTheDocument();
    expect(screen.queryByText('notifications.invalidObject')).not.toBeInTheDocument();
  });

  it('should render raw error messages directly if they are not translation keys', () => {
    const mockErrors: ValidationError[] = [{ path: 'info.title', message: 'Raw error from swagger parser' }];
    setupStoreMock({ isValid: false, errors: mockErrors });

    renderErrorList();

    expect(screen.getByText('info.title:')).toBeInTheDocument();
    expect(screen.getByText('Raw error from swagger parser')).toBeInTheDocument();
  });

  it('should have aria-live="polite" attribute for screen readers accessibility', () => {
    const mockErrors: ValidationError[] = [{ path: 'info', message: 'Error' }];
    setupStoreMock({ isValid: false, errors: mockErrors });

    renderErrorList();

    const panel = screen.getByTestId('error-list');
    expect(panel).toHaveAttribute('aria-live', 'polite');
  });

  it('should have the correct data-testid attribute for integration tests', () => {
    const mockErrors: ValidationError[] = [{ path: 'root', message: 'Some error' }];
    setupStoreMock({ isValid: false, errors: mockErrors });

    renderErrorList();

    const panel = screen.getByTestId('error-list');
    expect(panel).toBeInTheDocument();
  });
});
