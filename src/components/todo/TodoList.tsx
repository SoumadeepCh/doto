'use client';

import { Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { TodoItemError } from './TodoItemError';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface TodoListProps {
  todos: Array<{
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {todos.map((todo) => (
        <ErrorBoundary key={todo._id} fallback={TodoItemError}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </ErrorBoundary>
      ))}
    </div>
  );
}
