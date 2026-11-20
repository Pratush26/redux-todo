import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { ITodo, TodoDraft, TodoUpdate, TodoState, TodoCategory } from '../../types/todo.interface'

const initialState: TodoState = {
  todos: [],
  filter: {
    status: 'all',
    category: 'all',
  },
  loading: 'idle',
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<ITodo>) => {
        state.todos.unshift(action.payload)
      },
      prepare: (draft: TodoDraft) => {
        const now = new Date().toISOString()
        const payload: ITodo = {
          id: nanoid(),
          isCompleted: false,
          order: 0,
          createdAt: now,
          updatedAt: now,
          completedAt: null,
        //   dueDate: draft.dueDate ?? null,
        //   tags: draft.tags ?? [],
          ...draft,
        }
        return { payload }
      },
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload)
      if (todo) {
        todo.isCompleted = !todo.isCompleted
        todo.status = todo.isCompleted ? 'completed' : 'todo'
        todo.completedAt = todo.isCompleted ? new Date().toISOString() : null
        todo.updatedAt = new Date().toISOString()
      }
    },
    updateTodo: (state, action: PayloadAction<TodoUpdate>) => {
      const index = state.todos.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.todos[index] = {
          ...state.todos[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload)
    },
    setCategoryFilter: (state, action: PayloadAction<TodoCategory | 'all'>) => {
      state.filter.category = action.payload
    },
  },
})

export const { addTodo, toggleTodo, updateTodo, deleteTodo, setCategoryFilter } = todoSlice.actions

// Selectors
export const selectTodos = (state: RootState) => state.todo.todos
export const selectTodoFilter = (state: RootState) => state.todo.filter

export default todoSlice.reducer