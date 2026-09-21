import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createCourse, deleteCourse, getCourses, updateCourse } from '../../services/api/courseApi';

export const fetchCourses = createAsyncThunk('courses/fetch', getCourses);
export const addCourse = createAsyncThunk('courses/add', createCourse);
export const editCourse = createAsyncThunk('courses/edit', ({ id, changes }) => updateCourse(id, changes));
export const removeCourse = createAsyncThunk('courses/remove', async (id) => { await deleteCourse(id); return id; });

const coursesSlice = createSlice({
  name: 'courses',
  initialState: { items: [], loading: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; state.error = ''; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCourses.rejected, (state) => { state.loading = false; state.error = 'Gagal memuat data kursus.'; })
      .addCase(addCourse.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(editCourse.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default coursesSlice.reducer;
