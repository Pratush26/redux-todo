import type { TodoState } from '@/types/todo.interface'

const STORAGE_KEY = 'redux-todo'

export function loadTodoState(): TodoState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as TodoState
    if (!parsed || !Array.isArray(parsed.todos)) return undefined
    return parsed
  } catch {
    return undefined
  }
}

export function saveTodoState(state: TodoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore quota / private-mode errors
  }
}

export function clearTodoState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}