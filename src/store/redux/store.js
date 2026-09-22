import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './coursesReducer';
import catalogReducer from './catalogReducer';

export const store = configureStore({
  reducer: { courses: coursesReducer, catalog: catalogReducer },
});
