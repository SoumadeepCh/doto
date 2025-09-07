'use client';

import { useState } from 'react';
import { useLocalTodos } from '@/hooks/useLocalTodos';
import { TaskCreateInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TodoList } from './TodoList';
import { EmptyState } from '@/components/common/EmptyState';
import { Plus, Filter } from 'lucide-react';
import Link from 'next/link';

export function UnauthenticatedTodoApp() {
  const {
    loading,
    totalCount,
    activeCount,
    completedCount,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodos,
    getCategories,
    clearCompleted,
  } = useLocalTodos();

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoCategory, setNewTodoCategory] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = getCategories();
  const filteredTodos = getTodos(filter, selectedCategory);

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const todoData: TaskCreateInput = {
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim() || undefined,
      priority: newTodoPriority,
      category: newTodoCategory.trim() || undefined,
    };

    addTodo(todoData);

    // Reset form
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoPriority('medium');
    setNewTodoCategory('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTodo();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Todo App</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {totalCount} total
                </Badge>
                <Badge variant="default" className="text-xs">
                  {activeCount} active
                </Badge>
                {completedCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {completedCount} completed
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-2 py-1">
                📱 Stored locally
              </Badge>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In (Optional)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Add Todo Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Todo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="What needs to be done?"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div>
                <Input
                  placeholder="Description (optional)"
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={newTodoPriority} 
                onChange={(e) => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <Input
                placeholder="Category (optional)"
                value={newTodoCategory}
                onChange={(e) => setNewTodoCategory(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              
              <Button onClick={handleAddTodo} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Todo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {totalCount > 0 && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                
                <div className="flex gap-1">
                  {(['all', 'active', 'completed'] as const).map((filterOption) => (
                    <Button
                      key={filterOption}
                      variant={filter === filterOption ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(filterOption)}
                    >
                      {filterOption === 'all' ? 'All' : filterOption === 'active' ? 'Active' : 'Completed'}
                    </Button>
                  ))}
                </div>

                {categories.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">|</span>
                    <select 
                      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {completedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">|</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCompleted}
                      className="text-destructive hover:text-destructive"
                    >
                      Clear Completed
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todo List or Empty State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading todos...</p>
          </div>
        ) : filteredTodos.length > 0 ? (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        ) : totalCount === 0 ? (
          <EmptyState
            type="todos"
          />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No todos match the current filter.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
