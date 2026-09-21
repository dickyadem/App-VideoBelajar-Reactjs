import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, test, vi } from 'vitest';

vi.mock('../../services/api/courseApi', () => ({
  getCourses: vi.fn(),
  createCourse: vi.fn(),
  updateCourse: vi.fn(),
  deleteCourse: vi.fn(),
}));

const { getCourses, createCourse, updateCourse, deleteCourse } = await import('../../services/api/courseApi');
const { default: coursesReducer, fetchCourses, addCourse, editCourse, removeCourse } = await import('./coursesReducer');

function makeStore() {
  return configureStore({ reducer: { courses: coursesReducer } });
}

describe('coursesReducer', () => {
  test('fetchCourses stores GET result', async () => {
    getCourses.mockResolvedValue([{ id: '1', title: 'A' }]);
    const store = makeStore();
    await store.dispatch(fetchCourses());
    expect(store.getState().courses).toMatchObject({ items: [{ id: '1', title: 'A' }], loading: false, error: '' });
  });

  test('fetchCourses records failure', async () => {
    getCourses.mockRejectedValue(new Error('down'));
    const store = makeStore();
    await store.dispatch(fetchCourses());
    expect(store.getState().courses.error).toBe('Gagal memuat data kursus.');
  });

  test('add/edit/remove mutate the list', async () => {
    createCourse.mockResolvedValue({ id: '2', title: 'B' });
    updateCourse.mockResolvedValue({ id: '2', title: 'B updated' });
    deleteCourse.mockResolvedValue(undefined);
    const store = makeStore();
    await store.dispatch(addCourse({ title: 'B' }));
    expect(store.getState().courses.items).toEqual([{ id: '2', title: 'B' }]);
    await store.dispatch(editCourse({ id: '2', changes: { title: 'B updated' } }));
    expect(store.getState().courses.items[0].title).toBe('B updated');
    await store.dispatch(removeCourse('2'));
    expect(store.getState().courses.items).toEqual([]);
  });
});
