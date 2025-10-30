import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';

export const store = configureStore({
  reducer: rootReducer,
  // middleware / devTools par défaut déjà configurés
});

// pour TypeScript
export type AppDispatch = typeof store.dispatch;