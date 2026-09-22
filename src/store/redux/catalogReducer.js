import { createSlice } from '@reduxjs/toolkit';
import { addCourse, editCourse, fetchCourses, removeCourse } from './coursesReducer';

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: { courseDetails: {}, categories: [], paymentGroups: [], status: 'idle', error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.status = 'loading'; state.error = ''; })
      .addCase(fetchCourses.fulfilled, (state, { payload }) => {
        state.courseDetails = payload.courseDetails;
        state.categories = payload.categories;
        state.paymentGroups = payload.paymentGroups;
        state.status = 'succeeded';
      })
      .addCase(fetchCourses.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Gagal memuat data kelas. Silakan coba lagi.';
      })
      .addCase(addCourse.fulfilled, (state, { payload }) => {
        state.courseDetails[payload.slug] = { description: payload.description || '', tutorBio: '', modules: [], reviews: [] };
      })
      .addCase(editCourse.fulfilled, (state, { payload }) => {
        const detail = state.courseDetails[payload.slug];
        if (detail) detail.description = payload.description || '';
      })
      .addCase(removeCourse.fulfilled, (state, { payload }) => { delete state.courseDetails[payload.slug]; });
  },
});

export default catalogSlice.reducer;
