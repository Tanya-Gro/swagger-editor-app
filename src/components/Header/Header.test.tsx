import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';
import { HeaderView } from '@/views/Header/Header';
import { logoutAction } from './logout-action';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
}));

vi.mock('@/database/server-client', () => ({
  serverClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: mocks.getUser,
      },
    }),
  ),
}));

vi.mock('./logout-action', () => ({
  logoutAction: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Header', () => {
  it('returns HeaderView with unauthenticated state', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: null,
    });

    const result = await Header();

    expect(result.type).toBe(HeaderView);
    expect(result.props).toEqual({
      isAuthenticated: false,
      logoutAction,
    });
  });

  it('returns HeaderView with authenticated state', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-id',
        },
      },
      error: null,
    });

    const result = await Header();

    expect(result.type).toBe(HeaderView);
    expect(result.props).toEqual({
      isAuthenticated: true,
      logoutAction,
    });
  });
});
