import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './coursesReducer';

export const store = configureStore({
  reducer: { courses: coursesReducer },
});
