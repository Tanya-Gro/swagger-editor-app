import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EditorActions } from './EditorActions';

describe('EditorActions', () => {
  const onChangeFormat = vi.fn();
  const onClear = vi.fn();

  it('calls onChangeFormat when YAML selected', () => {
    render(<EditorActions format="JSON" onChangeFormat={onChangeFormat} onClear={onClear} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'YAML',
      }),
    );

    expect(onChangeFormat).toHaveBeenCalledWith('YAML');
  });

  it('calls onClear', () => {
    render(<EditorActions format="JSON" onChangeFormat={onChangeFormat} onClear={onClear} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear',
      }),
    );

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders action buttons', () => {
    render(<EditorActions format="JSON" onChangeFormat={vi.fn()} onClear={onClear} />);

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
