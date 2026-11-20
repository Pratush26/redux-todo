export type TodoId = string;

export type TodoStatus = 'todo' | 'in_progress' | 'completed' | 'archived';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoCategory = 'personal' | 'work' | 'shopping' | 'study' | 'other';

export interface ITodo {
  id: TodoId;
  title: string;
  description?: string;
  
  status: TodoStatus;
  isCompleted: boolean;
  priority: TodoPriority;
  category: TodoCategory; // <- replaced createdBy

  tags: string[];
  order: number;

  createdAt: string; // ISO
  updatedAt: string; // ISO
  dueDate: string | null;
  completedAt: string | null;
}

export type TodoDraft = Omit<ITodo, 'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'isCompleted' | 'order'>;
export type TodoUpdate = Partial<Omit<ITodo, 'id'>> & { id: TodoId };

export interface TodoState {
  todos: ITodo[];
  filter: {
    status: TodoStatus | 'all';
    category: TodoCategory | 'all';
  };
  loading: 'idle' | 'pending';
}