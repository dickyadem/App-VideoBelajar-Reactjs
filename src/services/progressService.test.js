import { beforeEach, expect, test, vi } from 'vitest';

const firestore = {
  doc: vi.fn(() => 'progress-ref'),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'timestamp'),
};
vi.mock('firebase/firestore', () => firestore);
vi.mock('../firebase', () => ({ db: 'db' }));

const { getProgress, saveProgress } = await import('./progressService');

beforeEach(() => Object.values(firestore).forEach((method) => method.mockReset()));

test('reads and writes progress under the authenticated user and course', async () => {
  firestore.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ completed: ['lesson-1'] }) });
  await expect(getProgress('uid-1', 'course-1')).resolves.toEqual(['lesson-1']);
  await saveProgress('uid-1', 'course-1', ['lesson-1', 'lesson-2']);
  expect(firestore.doc).toHaveBeenCalledWith('db', 'users', 'uid-1', 'progress', 'course-1');
  expect(firestore.setDoc).toHaveBeenCalledWith('progress-ref', expect.objectContaining({ completed: ['lesson-1', 'lesson-2'] }), { merge: true });
});
