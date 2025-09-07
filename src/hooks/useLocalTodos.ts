'use client';

import { useState, useEffect } from 'react';
import { Task, TaskCreateInput, TaskUpdateInput } from '@/types';

const LOCAL_STORAGE_KEY = 'todos_local';

// Generate a simple ID for local todos
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export function useLocalTodos() {
  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsedTodos = JSON.parse(stored, (key, value) => {
          // Parse dates back to Date objects
          if (key === 'createdAt' || key === 'updatedAt' || key === 'completedAt' || key === 'dueDate') {
            return value ? new Date(value) : null;
          }
          return value;
        });
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    }
  }, [todos, loading]);

  const addTodo = (todoData: TaskCreateInput): Task => {
    const newTodo: Task = {
      _id: generateId(),
      userId: 'local', // Local user identifier
      title: todoData.title,
      description: todoData.description || '',
      completed: false,
      priority: todoData.priority || 'medium',
      category: todoData.category || '',
      dueDate: todoData.dueDate ? new Date(todoData.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    };

    setTodos(prev => [newTodo, ...prev]);
    return newTodo;
  };

  const updateTodo = (id: string, updates: TaskUpdateInput): Task | null => {
    let updatedTodo: Task | null = null;
    
    setTodos(prev => prev.map(todo => {
      if (todo._id === id) {
        const wasCompleted = todo.completed;
        const newTodo: Task = {
          ...todo,
          ...updates,
          dueDate: updates.dueDate !== undefined 
            ? (updates.dueDate ? new Date(updates.dueDate) : null)
            : todo.dueDate,
          updatedAt: new Date(),
          completedAt: updates.completed && !wasCompleted ? new Date() : 
                       (!updates.completed && wasCompleted ? null : todo.completedAt),
        };
        updatedTodo = newTodo;
        return newTodo;
      }
      return todo;
    }));

    return updatedTodo;
  };

  const deleteTodo = (id: string): boolean => {
    setTodos(prev => prev.filter(todo => todo._id !== id));
    return true;
  };

  const toggleTodo = (id: string): Task | null => {
    return updateTodo(id, { completed: !todos.find(t => t._id === id)?.completed });
  };

  const getTodos = (filter?: 'all' | 'active' | 'completed', category?: string): Task[] => {
    let filtered = todos;

    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    if (category) {
      filtered = filtered.filter(todo => todo.category === category);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getCategories = (): string[] => {
    const categories = new Set<string>();
    todos.forEach(todo => {
      if (todo.category && todo.category.trim()) {
        categories.add(todo.category.trim());
      }
    });
    return Array.from(categories).sort();
  };

  const clearCompleted = (): number => {
    const completedCount = todos.filter(todo => todo.completed).length;
    setTodos(prev => prev.filter(todo => !todo.completed));
    return completedCount;
  };

  const importTodos = (newTodos: Task[]): void => {
    setTodos(newTodos);
  };

  const exportTodos = (): Task[] => {
    return todos;
  };

  return {
    todos: getTodos(),
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodos,
    getCategories,
    clearCompleted,
    importTodos,
    exportTodos,
    totalCount: todos.length,
    activeCount: todos.filter(todo => !todo.completed).length,
    completedCount: todos.filter(todo => todo.completed).length,
  };
}
