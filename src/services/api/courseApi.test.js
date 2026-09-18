import { beforeEach, describe, expect, test, vi } from 'vitest';

const requestMethods = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock('axios', () => ({
  default: { create: vi.fn(() => requestMethods) },
}));

const { createCourse, deleteCourse, getCourses, updateCourse } = await import('./courseApi');

describe('course API client', () => {
  beforeEach(() => {
    Object.values(requestMethods).forEach((request) => request.mockReset());
  });

  test('maps CRUD operations to Axios HTTP methods', async () => {
    requestMethods.get.mockResolvedValue({ data: [{ id: 'course-1' }] });
    requestMethods.post.mockResolvedValue({ data: { id: 'course-2' } });
    requestMethods.put.mockResolvedValue({ data: { id: 'course-1', title: 'Updated' } });
    requestMethods.delete.mockResolvedValue({ data: null });

    await expect(getCourses()).resolves.toEqual([{ id: 'course-1' }]);
    await expect(createCourse({ title: 'New' })).resolves.toEqual({ id: 'course-2' });
    await expect(updateCourse('course-1', { title: 'Updated' })).resolves.toEqual({ id: 'course-1', title: 'Updated' });
    await expect(deleteCourse('course-1')).resolves.toBeUndefined();

    expect(requestMethods.get).toHaveBeenCalledWith('/courses');
    expect(requestMethods.post).toHaveBeenCalledWith('/courses', { title: 'New' });
    expect(requestMethods.put).toHaveBeenCalledWith('/courses/course-1', { title: 'Updated' });
    expect(requestMethods.delete).toHaveBeenCalledWith('/courses/course-1');
  });
});
