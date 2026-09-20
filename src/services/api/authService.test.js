import { beforeEach, describe, expect, test, vi } from 'vitest';

const authMethods = {
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
};

vi.mock('firebase/auth', () => ({ ...authMethods, getAuth: vi.fn(() => ({})), onAuthStateChanged: vi.fn() }));
vi.mock('../../firebase', () => ({ auth: { currentUser: null } }));

const { createAccount, loginAccount, logoutAccount, updateAccountProfile } = await import('./authService');

describe('Firebase Auth service', () => {
  beforeEach(() => Object.values(authMethods).forEach((method) => method.mockReset()));

  test('creates account with email/password and profile name', async () => {
    const user = { uid: 'firebase-uid', updateProfile: authMethods.updateProfile };
    authMethods.createUserWithEmailAndPassword.mockResolvedValue({ user });

    await expect(createAccount('Dicky', 'dicky@example.com', 'rahasia')).resolves.toBe(user);
    expect(authMethods.createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'dicky@example.com', 'rahasia');
    expect(authMethods.updateProfile).toHaveBeenCalledWith(user, { displayName: 'Dicky' });
  });

  test('logs in and logs out through Firebase Auth', async () => {
    const user = { uid: 'firebase-uid' };
    authMethods.signInWithEmailAndPassword.mockResolvedValue({ user });

    await expect(loginAccount('dicky@example.com', 'rahasia')).resolves.toBe(user);
    await expect(logoutAccount()).resolves.toBeUndefined();
    expect(authMethods.signOut).toHaveBeenCalled();
  });

  test('explains invalid Firebase credentials', async () => {
    authMethods.signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    await expect(loginAccount('dicky@example.com', 'salah')).rejects.toThrow('Email atau kata sandi salah');
  });

  test('updates Firebase display name', async () => {
    const user = { uid: 'firebase-uid' };
    await updateAccountProfile(user, 'Nama Baru');
    expect(authMethods.updateProfile).toHaveBeenCalledWith(user, { displayName: 'Nama Baru' });
  });
});
