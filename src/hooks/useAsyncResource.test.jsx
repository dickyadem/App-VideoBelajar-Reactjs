import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useAsyncResource } from './useAsyncResource';

afterEach(cleanup);

test('reports failures and supports a successful retry', async () => {
  const load = vi.fn().mockRejectedValueOnce(new Error('internal')).mockResolvedValueOnce(['saved']);
  const { result } = renderHook(() => useAsyncResource(load, [], 'Gagal memuat.'));
  expect(result.current.loading).toBe(true);
  await waitFor(() => expect(result.current.error).toBe('Gagal memuat.'));
  act(() => result.current.reload());
  await waitFor(() => expect(result.current.data).toEqual(['saved']));
  expect(result.current.error).toBe('');
  expect(result.current.loading).toBe(false);
});

test('ignores a response from a previous resource after switching users', async () => {
  let resolveOld;
  const oldLoad = () => new Promise((resolve) => { resolveOld = resolve; });
  const newLoad = () => Promise.resolve(['new user']);
  const { result, rerender } = renderHook(({ load }) => useAsyncResource(load, [], 'Error'), { initialProps: { load: oldLoad } });
  rerender({ load: newLoad });
  await waitFor(() => expect(result.current.data).toEqual(['new user']));
  await act(async () => resolveOld(['old user']));
  expect(result.current.data).toEqual(['new user']);
});
