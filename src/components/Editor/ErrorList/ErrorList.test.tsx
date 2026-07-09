import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { ErrorList } from './ErrorList';
import type { ValidationError } from '@/types';
import messages from '@messages/en.json';

describe('ErrorList Component', () => {
  function renderErrorList(errors: ValidationError[]) {
    return render(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        <ErrorList errors={errors} />
      </NextIntlClientProvider>,
    );
  }

  it('should render nothing if the errors array is empty', () => {
    const { container } = renderErrorList([]);
    expect(container.firstChild).toBeNull();
  });

  it('should display error paths and messages correctly', () => {
    const mockErrors: ValidationError[] = [
      { path: 'info.version', message: 'must be a string' },
      { path: 'paths./users', message: 'must be an object' },
    ];

    renderErrorList(mockErrors);

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

    renderErrorList(mockErrors);

    expect(screen.getByText('info.title:')).toBeInTheDocument();
    expect(screen.getByText('Raw error from swagger parser')).toBeInTheDocument();
  });

  it('should render the header with the correct count of errors', () => {
    const mockErrors: ValidationError[] = [
      { path: 'info', message: 'Missing property' },
      { path: 'paths', message: 'Should be an object' },
    ];

    renderErrorList(mockErrors);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Specification errors (2):');
  });

  it('should correctly resolve and render localized message when it is a translation key', () => {
    const mockErrors: ValidationError[] = [{ path: 'root', message: 'notifications.invalidObject' }];

    renderErrorList(mockErrors);

    expect(screen.getByText('root:')).toBeInTheDocument();
    expect(screen.getByText('Schema must be a valid JSON/YAML object')).toBeInTheDocument();
    expect(screen.queryByText('notifications.invalidObject')).not.toBeInTheDocument();
  });

  it('should render raw error messages directly if they are not translation keys', () => {
    const mockErrors: ValidationError[] = [{ path: 'info.title', message: 'Raw error from swagger parser' }];

    renderErrorList(mockErrors);

    expect(screen.getByText('info.title:')).toBeInTheDocument();
    expect(screen.getByText('Raw error from swagger parser')).toBeInTheDocument();
  });

  it('should have aria-live="polite" attribute for screen readers accessibility', () => {
    const mockErrors: ValidationError[] = [{ path: 'info', message: 'Error' }];
    renderErrorList(mockErrors);

    const panel = screen.getByTestId('error-list');
    expect(panel).toHaveAttribute('aria-live', 'polite');
  });

  it('should have the correct data-testid attribute for integration tests', () => {
    const mockErrors: ValidationError[] = [{ path: 'root', message: 'Some error' }];
    renderErrorList(mockErrors);

    const panel = screen.getByTestId('error-list');
    expect(panel).toBeInTheDocument();
  });
});
