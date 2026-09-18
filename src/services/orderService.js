import { collection, doc, getDocsFromServer, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ADMIN_FEE } from '../data/paymentMethods';

function requireText(value, message) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(message);
}

function requireUser(userId) {
  requireText(userId, 'Silakan login terlebih dahulu.');
}

function orderReference(id) {
  requireText(id, 'Pesanan tidak ditemukan.');
  if (id.includes('/')) throw new Error('ID pesanan tidak valid.');
  return doc(db, 'orders', id);
}

async function editableOrder(transaction, reference, userId) {
  const snapshot = await transaction.get(reference);
  if (!snapshot.exists()) throw new Error('Pesanan tidak ditemukan.');
  const order = snapshot.data();
  if (order.userId !== userId || order.status !== 'Belum Bayar') throw new Error('Pesanan tidak tersedia untuk diubah.');
  return order;
}

export async function getOrders(userId) {
  requireUser(userId);
  const snapshot = await getDocsFromServer(query(collection(db, 'orders'), where('userId', '==', userId)));
  return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }));
}

export async function createOrder(userId, course, method, status = 'Belum Bayar') {
  requireUser(userId);
  requireText(course?.slug, 'Kelas tidak valid.');
  requireText(course?.title, 'Kelas tidak valid.');
  requireText(method, 'Pilih metode pembayaran.');
  if (!Number.isFinite(course.priceAmount) || course.priceAmount < 0) throw new Error('Harga kelas tidak valid.');
  if (!['Belum Bayar', 'Berhasil'].includes(status)) throw new Error('Status pesanan tidak valid.');
  const reference = doc(collection(db, 'orders'));
  const order = {
    userId, slug: course.slug, title: course.title, category: course.category || '', image: course.image || '',
    price: course.priceAmount, total: course.priceAmount + ADMIN_FEE, method, status, date: new Date().toISOString(),
  };
  // Transactions fail offline instead of leaving a queued write that looks complete.
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(reference);
    if (existing.exists()) throw new Error('Pesanan sudah tersedia.');
    transaction.set(reference, { ...order, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  });
  return { ...order, id: reference.id };
}

export async function updateOrder(userId, id, changes) {
  requireUser(userId);
  if (!changes || !Object.keys(changes).length || Object.keys(changes).some((key) => !['method', 'status'].includes(key))) throw new Error('Perubahan pesanan tidak valid.');
  if ('method' in changes) requireText(changes.method, 'Pilih metode pembayaran.');
  if ('status' in changes && changes.status !== 'Berhasil') throw new Error('Status pesanan tidak valid.');
  const reference = orderReference(id);
  return runTransaction(db, async (transaction) => {
    const order = await editableOrder(transaction, reference, userId);
    transaction.update(reference, { ...changes, updatedAt: serverTimestamp() });
    return { ...order, ...changes, id };
  });
}

export async function deleteOrder(userId, id) {
  requireUser(userId);
  const reference = orderReference(id);
  await runTransaction(db, async (transaction) => {
    await editableOrder(transaction, reference, userId);
    transaction.delete(reference);
  });
}
