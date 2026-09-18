import { beforeEach, expect, test, vi } from 'vitest';
import { setDoc } from 'firebase/firestore';
import { saveProfile } from './profileService';

beforeEach(() => vi.mocked(setDoc).mockReset().mockResolvedValue(undefined));

test('uploads only profile fields, not credentials, photo data or orders', async () => {
  await saveProfile({ uid: 'demo', name: 'A', email: 'a@example.com', phone: '123', password: 'private', photo: 'data:image/png;base64,abc', orders: [], role: 'admin' });
  expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
    uid: 'demo', name: 'A', email: 'a@example.com', phone: '123', role: 'student', updatedAt: expect.anything(),
  }, { merge: true });
});

test('rejects invalid identity before any write', async () => {
  await expect(saveProfile({ uid: 'invalid/id' })).rejects.toThrow('Identitas');
  expect(setDoc).not.toHaveBeenCalled();
});

test('propagates server rejection so the UI cannot report successful sync', async () => {
  vi.mocked(setDoc).mockRejectedValueOnce(new Error('denied'));
  await expect(saveProfile({ uid: 'demo' })).rejects.toThrow('denied');
});
