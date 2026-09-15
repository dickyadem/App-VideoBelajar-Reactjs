import { expect, test } from 'vitest';
import { courses } from './courses';

test('uses valid Unsplash photo URLs for every course', () => {
  expect(courses.every(({ image }) => image.startsWith('https://images.unsplash.com/photo-'))).toBe(true);
});
