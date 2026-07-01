import { describe, expect, it, vi } from 'vitest';
import { toast } from './toast';

describe('toast utility', () => {
  it('dispatches success event', () => {
    const dispatchSpy = vi.spyOn(globalThis, 'dispatchEvent');

    toast.success('Saved');

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.type).toBe('app:toast');
    expect(event.detail).toEqual({
      message: 'Saved',
      variant: 'success',
    });

    dispatchSpy.mockRestore();
  });

  it('dispatches error event', () => {
    const dispatchSpy = vi.spyOn(globalThis, 'dispatchEvent');

    toast.error('Oops');

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.detail).toEqual({
      message: 'Oops',
      variant: 'error',
    });

    dispatchSpy.mockRestore();
  });

  it('dispatches warning event', () => {
    const dispatchSpy = vi.spyOn(globalThis, 'dispatchEvent');

    toast.warning('Input data is not valid');

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.detail).toEqual({
      message: 'Input data is not valid',
      variant: 'warning',
    });

    dispatchSpy.mockRestore();
  });

  it('dispatches info event', () => {
    const dispatchSpy = vi.spyOn(globalThis, 'dispatchEvent');

    toast.info('User login');

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.detail).toEqual({
      message: 'User login',
      variant: 'info',
    });

    dispatchSpy.mockRestore();
  });
});
