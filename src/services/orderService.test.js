import { beforeEach, expect, test, vi } from 'vitest';

vi.unmock('./orderService');
vi.mock('../firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((_db, path) => path),
  doc: vi.fn((...args) => args.length === 1 ? { id: 'new-order', path: 'orders/new-order' } : `${args[1]}/${args[2]}`),
  query: vi.fn((collection, filter) => ({ collection, filter })),
  where: vi.fn((field, op, value) => ({ field, op, value })),
  getDocsFromServer: vi.fn(),
  runTransaction: vi.fn(),
  serverTimestamp: vi.fn(() => 'server-time'),
}));

import { getDocsFromServer, runTransaction } from 'firebase/firestore';
import * as service from './orderService';

const course = { id: 'course-1', slug: 'course-1', title: 'Kelas Firebase', category: 'business', image: '/course.webp', priceAmount: 125000 };
let transaction;
let saved;
beforeEach(() => {
  vi.clearAllMocks();
  saved = { userId: 'user-1', slug: 'course-1', status: 'Belum Bayar', method: 'bca', price: 125000, total: 132000, date: '2026-09-18T00:00:00.000Z' };
  transaction = { get: vi.fn(async () => ({ exists: () => true, data: () => saved })), set: vi.fn(), update: vi.fn(), delete: vi.fn() };
  runTransaction.mockImplementation(async (_db, callback) => callback(transaction));
  getDocsFromServer.mockResolvedValue({ docs: [{ id: 'order-1', data: () => saved }] });
});

test('GET reads only the current user orders from the server', async () => {
  await expect(service.getOrders('user-1')).resolves.toEqual([{ id: 'order-1', ...saved }]);
  expect(getDocsFromServer).toHaveBeenCalledWith({ collection: 'orders', filter: { field: 'userId', op: '==', value: 'user-1' } });
});

test('ADD stores course and payment snapshots with the owner and returns the saved order', async () => {
  transaction.get.mockResolvedValue({ exists: () => false });
  const result = await service.createOrder('user-1', course, 'bca');
  expect(result).toMatchObject({ userId: 'user-1', slug: 'course-1', price: 125000, total: 132000, method: 'bca', status: 'Belum Bayar' });
  expect(result.id).toBeTruthy();
  expect(transaction.set).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ userId: 'user-1', title: 'Kelas Firebase', status: 'Belum Bayar', createdAt: 'server-time' }));
});

test('UPDATE changes only editable fields and preserves price/owner', async () => {
  await expect(service.updateOrder('user-1', 'order-1', { method: 'bni' })).resolves.toMatchObject({ id: 'order-1', method: 'bni', price: 125000, userId: 'user-1' });
  expect(transaction.update).toHaveBeenCalledWith('orders/order-1', { method: 'bni', updatedAt: 'server-time' });
});

test('UPDATE can mark a demo payment successful', async () => {
  await expect(service.updateOrder('user-1', 'order-1', { status: 'Berhasil' })).resolves.toMatchObject({ status: 'Berhasil' });
});

test('DELETE removes a pending order from Firestore', async () => {
  await service.deleteOrder('user-1', 'order-1');
  expect(transaction.delete).toHaveBeenCalledWith('orders/order-1');
});

test.each(['updateOrder', 'deleteOrder'])('%s rejects another owner or completed order', async (operation) => {
  saved.userId = 'other-user';
  await expect(service[operation]('user-1', 'order-1', { method: 'bni' })).rejects.toThrow();
  saved.userId = 'user-1';
  saved.status = 'Berhasil';
  await expect(service[operation]('user-1', 'order-1', { method: 'bni' })).rejects.toThrow();
  expect(transaction.update).not.toHaveBeenCalled();
  expect(transaction.delete).not.toHaveBeenCalled();
});

test('rejects missing orders, invalid input, and edits to immutable fields', async () => {
  transaction.get.mockResolvedValue({ exists: () => false });
  await expect(service.deleteOrder('user-1', 'missing')).rejects.toThrow();
  await expect(service.getOrders('')).rejects.toThrow();
  await expect(service.createOrder('user-1', { ...course, priceAmount: -1 }, 'bca')).rejects.toThrow();
  await expect(service.createOrder('user-1', course, '')).rejects.toThrow();
  await expect(service.updateOrder('user-1', 'order-1', { price: 1 })).rejects.toThrow();
  await expect(service.updateOrder('user-1', 'order-1', { status: 'Gagal' })).rejects.toThrow();
});

test('propagates server failures instead of reporting a successful write', async () => {
  runTransaction.mockRejectedValue(new Error('unavailable'));
  await expect(service.createOrder('user-1', course, 'bca')).rejects.toThrow('unavailable');
  await expect(service.updateOrder('user-1', 'order-1', { method: 'bni' })).rejects.toThrow('unavailable');
  await expect(service.deleteOrder('user-1', 'order-1')).rejects.toThrow('unavailable');
});
