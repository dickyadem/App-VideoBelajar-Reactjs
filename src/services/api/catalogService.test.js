import { beforeEach, expect, test, vi } from 'vitest';

vi.mock('../../firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((_db, path) => path),
  getDocsFromServer: vi.fn(),
  doc: vi.fn(),
  writeBatch: vi.fn(),
}));

import { getDocsFromServer } from 'firebase/firestore';

const records = {
  courses: [
    { id: 'remote-course', slug: 'remote-course', title: 'Kelas dari Firebase', status: 'published', category: 'science', priceAmount: 125000, rating: 4.8, reviewCount: 12, description: 'Deskripsi remote', tutorBio: 'Tutor remote', image: '/remote.webp' },
    { id: 'hidden', slug: 'hidden', title: 'Draft', status: 'draft' },
  ],
  categories: [{ id: 'science', slug: 'science', name: 'Sains' }],
  modules: [{ id: 'm2', courseId: 'remote-course', title: 'Lanjutan', order: 2 }, { id: 'm1', courseId: 'remote-course', title: 'Dasar', order: 1 }, { id: 'other', courseId: 'hidden', title: 'Tidak tampil', order: 1 }],
  lessons: [{ id: 'l2', courseId: 'remote-course', moduleId: 'm1', title: 'Kedua', order: 2, minutes: 20, videoUrl: 'https://example.com/video.mp4' }, { id: 'l1', courseId: 'remote-course', moduleId: 'm1', title: 'Pertama', order: 1, minutes: 10 }],
  reviews: [{ id: 'r1', courseId: 'remote-course', name: 'Peserta', text: 'Ulasan remote' }, { id: 'r2', courseId: 'hidden', name: 'Lainnya', text: 'Bukan kelas ini' }],
  'payment-methods': [{ id: 'remote-bank', type: 'bank', name: 'Bank Remote', isActive: true }, { id: 'disabled', type: 'bank', name: 'Tidak aktif', isActive: false }, { id: 'card', type: 'card', name: 'Kartu Kredit/Debit', isActive: true }],
};

beforeEach(() => {
  vi.clearAllMocks();
  getDocsFromServer.mockImplementation(async (path) => ({ docs: (records[path] || []).map(({ id, ...data }) => ({ id, data: () => data })) }));
});

async function readCatalog() {
  const service = await import('./catalogService');
  return service.getCatalog();
}

test('reads Firestore collections and builds the UI catalog using document relations', async () => {
  const result = await readCatalog();
  expect(getDocsFromServer.mock.calls.map(([path]) => path).sort()).toEqual(Object.keys(records).sort());
  expect(result.courses).toHaveLength(1);
  expect(result.courses[0]).toMatchObject({ id: 'remote-course', slug: 'remote-course', title: 'Kelas dari Firebase', rating: '4.8 (12)', price: 'Rp 125.000', image: '/remote.webp' });
  const detail = result.courseDetails['remote-course'];
  expect(detail.description).toBe('Deskripsi remote');
  expect(detail.modules.map((module) => module.title)).toEqual(['Dasar', 'Lanjutan']);
  expect(detail.modules[0].lessons.map((lesson) => lesson.title)).toEqual(['Pertama', 'Kedua']);
  expect(detail.modules[0].lessons[1].videoUrl).toBe('https://example.com/video.mp4');
  expect(detail.modules[1].lessons).toEqual([]);
  expect(detail.reviews.map((review) => review.text)).toEqual(['Ulasan remote']);
  expect(result.categories).toEqual([['science', 'Sains']]);
});

test('only offers active payment methods and restores presentation metadata omitted by the seed', async () => {
  const result = await readCatalog();
  expect(result.paymentGroups.flatMap((group) => group.options.map((method) => method.id))).toEqual(['remote-bank', 'card']);
  expect(result.paymentGroups[0].title).toBe('Transfer Bank');
  expect(result.paymentGroups[1].options[0].brands).toEqual(['Mastercard', 'VISA', 'JCB']);
});

test('returns empty collections without substituting local courses', async () => {
  getDocsFromServer.mockResolvedValue({ docs: [] });
  await expect(readCatalog()).resolves.toEqual({ courses: [], courseDetails: {}, categories: [], paymentGroups: [] });
});

test('propagates a failed read instead of returning a partial or mock catalog', async () => {
  getDocsFromServer.mockRejectedValueOnce(new Error('permission-denied'));
  await expect(readCatalog()).rejects.toThrow('permission-denied');
});
