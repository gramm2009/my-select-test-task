import { configureStore } from '@reduxjs/toolkit';
import optionsReducer from './slices/optionsSlice';
import selectReducer from './slices/selectSlice';
import apiReducer from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    options: optionsReducer,
    select: selectReducer,
    api: apiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;