import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useCourseProgress } from './useCourseProgress';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { name: 'Test' } }) }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

test('keeps progress unchanged after storage failure and allows retry', () => {
  const { result } = renderHook(() => useCourseProgress('course', { modules: [] }));
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('quota'); });
  act(() => result.current.markComplete('pretest'));
  expect(result.current.completed).not.toContain('pretest');
  expect(result.current.error).toBe('Progres belum tersimpan di browser.');
  act(() => result.current.markComplete('pretest'));
  expect(result.current.completed).toContain('pretest');
  expect(result.current.error).toBe('');
  expect(write).toHaveBeenCalledTimes(2);
});
