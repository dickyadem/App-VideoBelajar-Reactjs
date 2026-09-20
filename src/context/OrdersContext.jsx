import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import * as orderService from '../services/api/orderService';
import { useAsyncResource } from '../hooks/useAsyncResource';

const OrdersContext = createContext(null);

function OrderState({ userId, children }) {
  const load = useCallback(() => userId ? orderService.getOrders(userId) : Promise.resolve([]), [userId]);
  const { data: orders, setData: setOrders, loading, error: loadError, reload } = useAsyncResource(load, [], 'Gagal memuat pesanan. Silakan coba lagi.');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const alive = useRef(false);
  const writing = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  async function mutate(operation, apply) {
    if (writing.current || loading || loadError) throw new Error('Tunggu sampai pesanan selesai diproses.');
    writing.current = true;
    setPending(true);
    setError('');
    try {
      const result = await operation();
      if (!alive.current) throw new Error('Sesi pesanan sudah berubah.');
      setOrders((current) => apply(current, result));
      setError('');
      return result;
    } catch (operationError) {
      if (alive.current) setError('Operasi pesanan gagal. Silakan coba lagi.');
      throw operationError;
    } finally {
      writing.current = false;
      if (alive.current) setPending(false);
    }
  }

  async function updateOrder(id, changes) {
    return mutate(() => orderService.updateOrder(userId, id, changes), (current, result) => current.map((item) => item.id === id ? result : item));
  }

  async function createOrder(course, method, status = 'Belum Bayar') {
    const existing = orders.find((order) => order.slug === course.slug && order.status === 'Belum Bayar');
    if (existing) {
      await updateOrder(existing.id, status === 'Berhasil' ? { method, status } : { method });
      return existing.id;
    }
    const result = await mutate(() => orderService.createOrder(userId, course, method, status), (current, saved) => [saved, ...current]);
    return result.id;
  }

  async function deleteOrder(id) {
    await mutate(() => orderService.deleteOrder(userId, id), (current) => current.filter((item) => item.id !== id));
  }

  return <OrdersContext.Provider value={{ orders, loading, loadError, error, pending, createOrder, updateOrder, deleteOrder, reload }}>{children}</OrdersContext.Provider>;
}

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  return <OrderState key={user?.uid} userId={user?.uid}>{children}</OrderState>;
}

export function useOrders() {
  const orders = useContext(OrdersContext);
  if (!orders) throw new Error('useOrders harus digunakan di dalam OrdersProvider');
  return orders;
}
