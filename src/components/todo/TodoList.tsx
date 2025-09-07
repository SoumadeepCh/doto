'use client';

import { Task, TaskUpdateInput } from '@/types';
import { TodoItem } from './TodoItem';
import { TodoItemError } from './TodoItemError';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface TodoListProps {
  todos: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: TaskUpdateInput) => void;
}

export function TodoList({ todos, onToggle, onDelete, onUpdate }: TodoListProps) {
  if (todos.length === 0) {
    return null;
  }

  const handleEdit = (id: string, title: string) => {
    onUpdate(id, { title });
  };

  return (
    <div className="space-y-3 mb-6">
      {todos.map((todo) => (
        <ErrorBoundary key={todo._id} fallback={TodoItemError}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={handleEdit}
          />
        </ErrorBoundary>
      ))}
    </div>
  );
}
