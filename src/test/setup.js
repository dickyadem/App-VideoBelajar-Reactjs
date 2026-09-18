import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';
import { resetOrderServiceMock } from './orderServiceMock';

const authState = { currentUser: null, listeners: [] };

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => authState),
  createUserWithEmailAndPassword: vi.fn(async (_auth, email) => {
    authState.currentUser = { uid: `uid-${email}`, email, displayName: null };
    authState.listeners.forEach((listener) => listener(authState.currentUser));
    return { user: authState.currentUser };
  }),
  signInWithEmailAndPassword: vi.fn(async (_auth, email) => {
    authState.currentUser = { uid: `uid-${email}`, email, displayName: email.split('@')[0] };
    authState.listeners.forEach((listener) => listener(authState.currentUser));
    return { user: authState.currentUser };
  }),
  signOut: vi.fn(async () => {
    authState.currentUser = null;
    authState.listeners.forEach((listener) => listener(null));
  }),
  updateProfile: vi.fn(async (user, updates) => Object.assign(user, updates)),
  onAuthStateChanged: vi.fn((_auth, listener) => {
    authState.listeners.push(listener);
    listener(authState.currentUser);
    return () => { authState.listeners = authState.listeners.filter((item) => item !== listener); };
  }),
}));

vi.mock('../services/orderService', () => import('./orderServiceMock'));
beforeEach(resetOrderServiceMock);
beforeEach(() => { authState.currentUser = null; authState.listeners = []; });

// UI tests exercise local authentication without writing profiles to live Firestore.
vi.mock('firebase/firestore', async (importOriginal) => ({
  ...await importOriginal(),
  setDoc: vi.fn().mockResolvedValue(undefined),
}));
