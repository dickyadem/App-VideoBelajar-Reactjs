import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import * as orderService from '../services/orderService';

const OrdersContext = createContext(null);

function OrderState({ userId, children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const alive = useRef(false);
  const writing = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const result = await orderService.getOrders(userId);
        if (active) setOrders(result);
      } catch {
        if (active) setError('Gagal memuat pesanan. Silakan coba lagi.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [userId, attempt]);

  async function mutate(operation, apply) {
    if (writing.current || loading || error) throw new Error('Tunggu sampai pesanan selesai diproses.');
    writing.current = true;
    setPending(true);
    try {
      const result = await operation();
      if (!alive.current) throw new Error('Sesi pesanan sudah berubah.');
      setOrders((current) => apply(current, result));
      return result;
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

  return <OrdersContext.Provider value={{ orders, loading, error, pending, createOrder, updateOrder, deleteOrder, reload: () => setAttempt((value) => value + 1) }}>{children}</OrdersContext.Provider>;
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
