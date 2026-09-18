import apiClient from './apiClient';

export async function getCourses() {
  const response = await apiClient.get('/courses');
  return response.data;
}

export async function createCourse(course) {
  const response = await apiClient.post('/courses', course);
  return response.data;
}

export async function updateCourse(id, changes) {
  const response = await apiClient.put(`/courses/${id}`, changes);
  return response.data;
}

export async function deleteCourse(id) {
  await apiClient.delete(`/courses/${id}`);
}
