import { useAuth } from './AuthContext';
import { ADMIN_FEE } from '../data/paymentMethods';

export function useOrders() {
  const { user, updateUser } = useAuth();
  const orders = Array.isArray(user?.orders) ? user.orders : [];
  function save(next) {
    if (!user) throw new Error('Silakan login terlebih dahulu.');
    localStorage.setItem('videobelajar-user', JSON.stringify({ ...user, orders: next }));
    updateUser({ orders: next });
  }
  function createOrder(course, method, status = 'Belum Bayar') {
    const existing = orders.find((order) => order.slug === course.slug && order.status === 'Belum Bayar');
    if (existing) { updateOrder(existing.id, { method, status }); return existing.id; }
    const order = { id: crypto.randomUUID(), slug: course.slug, title: course.title, category: course.category, image: course.image, price: course.priceAmount, total: course.priceAmount + ADMIN_FEE, method, status, date: new Date().toISOString() };
    save([order, ...orders]);
    return order.id;
  }
  function updateOrder(id, changes) {
    const order = orders.find((item) => item.id === id);
    if (!order || order.status !== 'Belum Bayar') throw new Error('Pesanan tidak tersedia untuk diubah.');
    save(orders.map((item) => item.id === id ? { ...item, method: changes.method || item.method, status: changes.status === 'Berhasil' ? 'Berhasil' : item.status } : item));
  }
  function deleteOrder(id) {
    if (!orders.some((order) => order.id === id && order.status === 'Belum Bayar')) return;
    save(orders.filter((order) => order.id !== id));
  }
  return { orders, createOrder, updateOrder, deleteOrder };
}
