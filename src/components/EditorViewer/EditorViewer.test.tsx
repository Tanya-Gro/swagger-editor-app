import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EditorViewer } from './EditorViewer';

describe('EditorViewer', () => {
  it('renders the editor and viewer panels with placeholder content', () => {
    render(<EditorViewer />);

    const editor = screen.getByRole('region', { name: 'Swagger Editor' });
    const viewer = screen.getByRole('region', { name: 'Swagger Viewer' });

    expect(within(editor).getByText('Editor placeholder')).toBeInTheDocument();
    expect(within(viewer).getByText('Sample API v1.0.0')).toBeInTheDocument();
    expect(within(viewer).getByText('Viewer placeholder')).toBeInTheDocument();
  });
});
