import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { loadTodoState } from '@/lib/db'

const preloadedTodo = loadTodoState()

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedTodo ? { todo: preloadedTodo } : undefined,
  devTools: false
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store