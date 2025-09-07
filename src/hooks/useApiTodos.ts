'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Todo {
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
}

export type TodoFilter = 'all' | 'active' | 'completed';

interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

export function useApiTodos() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isClearingSamples, setIsClearingSamples] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedForData, setHasCheckedForData] = useState(false);

  // Fetch todos from API
  const fetchTodos = useCallback(async () => {
    if (status !== 'authenticated' || !session) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks?filter=${filter}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();
      setTodos(data.tasks || []);
      setHasCheckedForData(true);
    } catch (error) {
      console.error('Fetch todos error:', error);
      setError('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  }, [session, status, filter]);

  // Add todo
  const addTodo = useCallback(async (title: string, description?: string, priority?: string, category?: string) => {
    if (!session || !title.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description?.trim(),
          priority: priority || 'medium',
          category: category?.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const data = await response.json();
      setTodos(prev => [data.task, ...prev]);
    } catch (error) {
      console.error('Add todo error:', error);
      setError('Failed to add todo');
    }
  }, [session]);

  // Toggle todo completion
  const toggleTodo = useCallback(async (id: string) => {
    if (!session) return;

    const todo = todos.find(t => t._id === id);
    if (!todo) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const data = await response.json();
      setTodos(prev => prev.map(t => t._id === id ? data.task : t));
    } catch (error) {
      console.error('Toggle todo error:', error);
      setError('Failed to update todo');
    }
  }, [session, todos]);

  // Delete todo
  const deleteTodo = useCallback(async (id: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Delete todo error:', error);
      setError('Failed to delete todo');
    }
  }, [session]);

  // Edit todo
  const editTodo = useCallback(async (id: string, title: string, description?: string, priority?: string, category?: string) => {
    if (!session || !title.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description?.trim(),
          priority,
          category: category?.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const data = await response.json();
      setTodos(prev => prev.map(t => t._id === id ? data.task : t));
    } catch (error) {
      console.error('Edit todo error:', error);
      setError('Failed to update todo');
    }
  }, [session]);

  // Clear completed todos
  const clearCompleted = useCallback(async () => {
    if (!session) return;

    const completedTodos = todos.filter(t => t.completed);
    
    try {
      await Promise.all(
        completedTodos.map(todo =>
          fetch(`/api/tasks/${todo._id}`, {
            method: 'DELETE',
          })
        )
      );

      setTodos(prev => prev.filter(t => !t.completed));
    } catch (error) {
      console.error('Clear completed error:', error);
      setError('Failed to clear completed todos');
    }
  }, [session, todos]);

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // Calculate stats
  const stats: TodoStats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  // Count sample todos
  const sampleTodoCount = todos.filter(t => t.category === '📚 Sample').length;

  // Fetch todos when session changes or filter changes
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Initialize sample data for new users
  const initializeSampleData = useCallback(async () => {
    if (!session) return;

    setIsInitializing(true);
    setError(null);

    try {
      const response = await fetch('/api/user/initialize', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to initialize sample data');
      }

      const data = await response.json();
      
      if (data.initialized) {
        // Refresh todos after initialization
        await fetchTodos();
      }
    } catch (error) {
      console.error('Initialize sample data error:', error);
      setError('Failed to create sample data');
    } finally {
      setIsInitializing(false);
    }
  }, [session, fetchTodos]);

  // Clear sample data
  const clearSampleData = useCallback(async () => {
    if (!session) return;

    setIsClearingSamples(true);
    setError(null);

    try {
      const response = await fetch('/api/user/clear-samples', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear sample data');
      }

      const data = await response.json();
      
      if (data.deletedCount > 0) {
        // Refresh todos after clearing samples
        await fetchTodos();
      }
    } catch (error) {
      console.error('Clear sample data error:', error);
      setError('Failed to clear sample data');
    } finally {
      setIsClearingSamples(false);
    }
  }, [session, fetchTodos]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    todos,
    filteredTodos,
    filter,
    stats,
    sampleTodoCount,
    isLoading,
    isInitializing,
    isClearingSamples,
    error,
    hasCheckedForData,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
    refetch: fetchTodos,
    initializeSampleData,
    clearSampleData,
  };
}
