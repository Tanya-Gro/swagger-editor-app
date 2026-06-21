import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Editor } from '@components/Editor/Editor';
import { Viewer } from '@components/Viewer/Viewer';
import { EditorViewerLayout } from './EditorViewerLayout';

describe('EditorViewerLayout', () => {
  it('renders separate editor and viewer components', () => {
    render(<EditorViewerLayout editor={<Editor />} viewer={<Viewer />} />);

    const editor = screen.getByRole('region', { name: 'Swagger Editor' });
    const viewer = screen.getByRole('region', { name: 'Swagger Viewer' });

    expect(within(editor).getByText('Editor placeholder')).toBeInTheDocument();
    expect(within(viewer).getByText('Viewer placeholder')).toBeInTheDocument();
  });
});
