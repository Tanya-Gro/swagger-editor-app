import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Editor } from './Editor';

describe('Editor', () => {
  it('switches between YAML and JSON formats', () => {
    render(<Editor />);

    const yamlButton = screen.getByRole('button', { name: 'YAML' });
    const jsonButton = screen.getByRole('button', { name: 'JSON' });

    expect(yamlButton).toHaveAttribute('aria-pressed', 'true');
    expect(jsonButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(jsonButton);

    expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
    expect(yamlButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders editor action buttons', () => {
    render(<Editor />);

    expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load' })).toBeInTheDocument();
  });
});
