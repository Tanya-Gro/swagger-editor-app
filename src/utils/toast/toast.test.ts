import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from './toast';

describe('toast utility', () => {
  let dispatchSpy: import('vitest').MockInstance<typeof globalThis.dispatchEvent>;

  beforeEach(() => {
    dispatchSpy = vi.spyOn(globalThis, 'dispatchEvent');
  });

  it('dispatches success event', () => {
    toast.success('Saved');

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.type).toBe('app:toast');
    expect(event.detail).toEqual({
      message: 'Saved',
      variant: 'success',
    });
  });

  it('dispatches error event', () => {
    toast.error('Oops');

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.type).toBe('app:toast');
    expect(event.detail).toEqual({
      message: 'Oops',
      variant: 'error',
    });
  });

  it('dispatches warning event', () => {
    toast.warning('Input data is not valid');

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.type).toBe('app:toast');
    expect(event.detail).toEqual({
      message: 'Input data is not valid',
      variant: 'warning',
    });
  });

  it('dispatches info event', () => {
    toast.info('User login');

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

    expect(event.type).toBe('app:toast');
    expect(event.detail).toEqual({
      message: 'User login',
      variant: 'info',
    });
  });
});
