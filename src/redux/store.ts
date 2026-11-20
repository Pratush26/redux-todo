import { configureStore } from '@reduxjs/toolkit'
import todoReducer from './features/todo'

export const store = configureStore({
  reducer: {
    todo: todoReducer
  }
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store