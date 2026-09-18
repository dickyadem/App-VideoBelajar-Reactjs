import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';
import { resetOrderServiceMock } from './orderServiceMock';

vi.mock('../services/orderService', () => import('./orderServiceMock'));
beforeEach(resetOrderServiceMock);

// UI tests exercise local authentication without writing profiles to live Firestore.
vi.mock('firebase/firestore', async (importOriginal) => ({
  ...await importOriginal(),
  setDoc: vi.fn().mockResolvedValue(undefined),
}));
