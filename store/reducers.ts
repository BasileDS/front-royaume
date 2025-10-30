import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export const rootReducer = combineReducers({
  counter: counterReducer,
  // … tes autres slices
});

export type RootState = ReturnType<typeof rootReducer>;