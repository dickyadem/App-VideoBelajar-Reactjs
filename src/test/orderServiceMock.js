import { vi } from 'vitest';

// In-memory backend for UI tests only. Older test sessions supply the fixtures.
const records = new Map();
export const getOrders = vi.fn();
export const createOrder = vi.fn();
export const updateOrder = vi.fn();
export const deleteOrder = vi.fn();
export const readMockOrders = () => [...records.values()].flat();

export function resetOrderServiceMock() {
  records.clear();
  getOrders.mockReset().mockImplementation(async (userId) => {
    if (!records.has(userId)) {
      const fixtures = JSON.parse(localStorage.getItem('videobelajar-user'))?.orders || [];
      records.set(userId, fixtures.map((order, index) => ({ ...order, id: order.id || `fixture-${index}`, userId })));
    }
    return structuredClone(records.get(userId));
  });
  createOrder.mockReset().mockImplementation(async (userId, course, method, status = 'Belum Bayar') => {
    const order = { id: crypto.randomUUID(), userId, slug: course.slug, title: course.title, category: course.category, image: course.image, price: course.priceAmount, total: course.priceAmount + 7000, method, status, date: new Date().toISOString() };
    records.set(userId, [...(records.get(userId) || []), order]);
    return structuredClone(order);
  });
  updateOrder.mockReset().mockImplementation(async (userId, id, changes) => {
    const list = records.get(userId) || [];
    const order = list.find((item) => item.id === id);
    if (!order) throw new Error('Order not found');
    const updated = { ...order, ...changes };
    records.set(userId, list.map((item) => item.id === id ? updated : item));
    return structuredClone(updated);
  });
  deleteOrder.mockReset().mockImplementation(async (userId, id) => {
    records.set(userId, (records.get(userId) || []).filter((item) => item.id !== id));
  });
}
