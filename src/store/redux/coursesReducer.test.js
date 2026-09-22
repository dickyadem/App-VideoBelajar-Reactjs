import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, test, vi } from 'vitest';

vi.mock('../../services/api/courseApi', () => ({
  createCourse: vi.fn(),
  updateCourse: vi.fn(),
  deleteCourse: vi.fn(),
}));
vi.mock('../../services/api/catalogService', () => ({ getCatalog: vi.fn() }));

const { createCourse, updateCourse, deleteCourse } = await import('../../services/api/courseApi');
const { getCatalog } = await import('../../services/api/catalogService');
const { default: coursesReducer, fetchCourses, addCourse, editCourse, removeCourse } = await import('./coursesReducer');
const { default: catalogReducer } = await import('./catalogReducer');

function makeStore() {
  return configureStore({ reducer: { courses: coursesReducer, catalog: catalogReducer } });
}

describe('coursesReducer', () => {
  test('fetchCourses stores GET result', async () => {
    getCatalog.mockResolvedValue({ courses: [{ id: '1', title: 'A' }], courseDetails: {}, categories: [], paymentGroups: [] });
    const store = makeStore();
    expect(store.getState().courses).toEqual([]);
    await store.dispatch(fetchCourses());
    expect(store.getState().courses).toEqual([{ id: '1', title: 'A' }]);
    expect(store.getState().catalog).toMatchObject({ status: 'succeeded', error: '' });
  });

  test('fetchCourses records failure', async () => {
    getCatalog.mockRejectedValue(new Error('down'));
    const store = makeStore();
    await store.dispatch(fetchCourses());
    expect(store.getState().catalog.error).toBe('Gagal memuat data kelas. Silakan coba lagi.');
  });

  test('add/edit/remove mutate the list', async () => {
    createCourse.mockResolvedValue({ id: '2', slug: 'stable-slug', title: 'B', description: 'Old', priceAmount: 99000 });
    updateCourse.mockResolvedValue({ id: '2', title: 'B updated', description: 'New', priceAmount: 125000 });
    deleteCourse.mockResolvedValue(undefined);
    const store = makeStore();
    await store.dispatch(addCourse({ title: 'B' }));
    expect(store.getState().courses[0]).toMatchObject({ id: '2', title: 'B', price: 'Rp 99.000' });
    await store.dispatch(editCourse({ id: '2', changes: { title: 'B updated' } }));
    expect(store.getState().courses[0]).toMatchObject({ title: 'B updated', slug: 'stable-slug', price: 'Rp 125.000' });
    expect(store.getState().catalog.courseDetails['stable-slug'].description).toBe('New');
    await store.dispatch(removeCourse('2'));
    expect(store.getState().courses).toEqual([]);
    expect(store.getState().catalog.courseDetails).toEqual({});
  });
});
