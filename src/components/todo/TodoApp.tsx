'use client';

import { useTodos } from '@/hooks/useTodos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TodoInput } from './TodoInput';
import { TodoFilter } from './TodoFilter';
import { TodoList } from './TodoList';
import { TodoStats } from './TodoStats';
import { CheckSquare } from 'lucide-react';

export function TodoApp() {
  const {
    filteredTodos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
  } = useTodos();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold">
              <CheckSquare className="h-8 w-8 text-primary" />
              Todo List
            </CardTitle>
            <p className="text-muted-foreground">
              Organize your tasks and stay productive
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <TodoInput onAddTodo={addTodo} />
            
            <TodoFilter
              currentFilter={filter}
              onFilterChange={setFilter}
              stats={stats}
            />
            
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
            
            <TodoStats
              stats={stats}
              onClearCompleted={clearCompleted}
            />
          </CardContent>
        </Card>
        
        <footer className="text-center text-sm text-muted-foreground mt-8">
          <p>Built with Next.js, TypeScript, and shadcn/ui</p>
        </footer>
      </div>
    </div>
  );
}
