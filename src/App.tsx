import { useState } from 'react'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import {
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  setCategoryFilter,
  setStatusFilter,
  clearCompleted,
  selectFilteredTodos,
  selectTodoCounts,
  selectTodoFilter,
} from './redux/features/todo'
import type { TodoCategory, TodoPriority, TodoStatus } from './types/todo.interface'
import { Button } from './components/ui/button'
import { cn } from './lib/utils'
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Search,
  ListTodo,
} from 'lucide-react'

const CATEGORIES: TodoCategory[] = ['personal', 'work', 'shopping', 'study', 'other']
const PRIORITIES: TodoPriority[] = ['low', 'medium', 'high', 'urgent']

const priorityColor: Record<TodoPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

function App() {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(selectFilteredTodos)
  const counts = useAppSelector(selectTodoCounts)
  const filter = useAppSelector(selectTodoFilter)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TodoPriority>('medium')
  const [category, setCategory] = useState<TodoCategory>('personal')
  const [dueDate, setDueDate] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    dispatch(
      addTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'todo' as TodoStatus,
        priority,
        category,
        tags: [],
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      }),
    )
    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategory('personal')
    setDueDate('')
  }

  const startEdit = (id: string, current: string) => {
    setEditingId(id)
    setEditTitle(current)
  }

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      dispatch(updateTodo({ id, title: editTitle.trim() }))
    }
    setEditingId(null)
    setEditTitle('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const visibleTodos = search.trim()
    ? todos.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : todos

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ListTodo className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Redux Todo</h1>
            <p className="text-sm text-muted-foreground">
              {counts.active} active · {counts.completed} completed · {counts.total} total
            </p>
          </div>
        </header>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
            <div className="flex flex-wrap gap-2">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TodoPriority)}
                className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TodoCategory)}
                className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
              />
              <Button type="submit" size="sm" className="ml-auto">
                <Plus className="size-4" /> Add
              </Button>
            </div>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted p-1">
            {(['all', 'todo', 'completed'] as const).map(s => (
              <button
                key={s}
                onClick={() => dispatch(setStatusFilter(s === 'all' ? 'all' : (s as TodoStatus)))}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition',
                  filter.status === s || (s === 'all' && filter.status === 'all')
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s === 'all' ? 'All' : s === 'todo' ? 'Active' : 'Completed'}
              </button>
            ))}
          </div>
          <select
            value={filter.category}
            onChange={e => dispatch(setCategoryFilter(e.target.value as TodoCategory | 'all'))}
            className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative ml-auto">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="rounded-lg border border-input bg-background py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
          {counts.completed > 0 && (
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearCompleted())}>
              <Trash2 className="size-4" /> Clear completed
            </Button>
          )}
        </div>

        {/* List */}
        <ul className="flex flex-col gap-2">
          {visibleTodos.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No todos here. Add one above!
            </li>
          )}
          {visibleTodos.map(todo => (
            <li
              key={todo.id}
              className={cn(
                'group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition',
                todo.isCompleted && 'opacity-60',
              )}
            >
              <button
                onClick={() => dispatch(toggleTodo(todo.id))}
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-input transition',
                  todo.isCompleted && 'border-primary bg-primary text-primary-foreground',
                )}
                aria-label="Toggle complete"
              >
                {todo.isCompleted && <Check className="size-3.5" />}
              </button>

              <div className="min-w-0 flex-1">
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(todo.id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      autoFocus
                      className="w-full rounded-lg border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                    />
                    <Button size="icon-sm" onClick={() => saveEdit(todo.id)}>
                      <Check className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={cancelEdit}>
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p
                      className={cn(
                        'text-sm font-medium',
                        todo.isCompleted && 'line-through text-muted-foreground',
                      )}
                    >
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{todo.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase',
                          priorityColor[todo.priority],
                        )}
                      >
                        {todo.priority}
                      </span>
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {todo.category}
                      </span>
                      {todo.dueDate && (
                        <span className="text-[10px] text-muted-foreground">
                          due {new Date(todo.dueDate).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {editingId !== todo.id && (
                <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => startEdit(todo.id, todo.title)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => dispatch(deleteTodo(todo.id))}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default App