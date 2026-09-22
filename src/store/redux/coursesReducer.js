import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createCourse, deleteCourse, updateCourse } from '../../services/api/courseApi';
import { getCatalog } from '../../services/api/catalogService';

export const fetchCourses = createAsyncThunk('courses/fetch', () => getCatalog(), {
  condition: (_, { getState }) => getState().catalog?.status !== 'loading',
});

function displayCourse(course) {
  return {
    ...course,
    slug: course.slug || course.id,
    priceAmount: Number(course.priceAmount) || 0,
    price: `Rp ${(Number(course.priceAmount) || 0).toLocaleString('id-ID')}`,
    imageAlt: course.imageAlt || course.title,
    rating: typeof course.rating === 'string' ? course.rating : `${Number(course.rating) || 0} (${Number(course.reviewCount) || 0})`,
  };
}

export const addCourse = createAsyncThunk('courses/add', async (course) => displayCourse(await createCourse(course)));
export const editCourse = createAsyncThunk('courses/edit', async ({ id, changes }, { getState }) => {
  const course = getState().courses.find((item) => item.id === id);
  const result = await updateCourse(id, changes);
  return displayCourse({ ...course, ...result, id });
});
export const removeCourse = createAsyncThunk('courses/remove', async (id, { getState }) => {
  const slug = getState().courses.find((item) => item.id === id)?.slug;
  await deleteCourse(id);
  return { id, slug };
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.fulfilled, (_, action) => action.payload.courses)
      .addCase(addCourse.fulfilled, (state, action) => { state.push(action.payload); })
      .addCase(editCourse.fulfilled, (state, action) => {
        const index = state.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state[index] = action.payload;
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        return state.filter((item) => item.id !== action.payload.id);
      });
  },
});

export default coursesSlice.reducer;
