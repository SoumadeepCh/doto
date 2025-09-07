'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useApiTodos } from '@/hooks/useApiTodos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TodoList } from './TodoList';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { EmptyState } from '@/components/common/EmptyState';
import { 
  Plus, 
  Filter, 
  LogOut, 
  BarChart3, 
  CheckSquare,
  User
} from 'lucide-react';

export function AuthenticatedTodoApp() {
  const { data: session } = useSession();
  const {
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
    refetch,
    initializeSampleData,
    clearSampleData,
  } = useApiTodos();

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoCategory, setNewTodoCategory] = useState('');

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    await addTodo(
      newTodoTitle.trim(),
      newTodoDescription.trim() || undefined,
      newTodoPriority,
      newTodoCategory.trim() || undefined
    );

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

  const categories = [...new Set(todos.map(t => t.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Todo Dashboard</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {stats.total} total
                </Badge>
                <Badge variant="default" className="text-xs">
                  {stats.active} active
                </Badge>
                {stats.completed > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {stats.completed} completed
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-1">
                ☁️ Cloud synced
              </Badge>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            {/* Add Todo Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Task
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
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sample Data Management */}
            {hasCheckedForData && stats.total === 0 && (
              <Card>
                <CardContent className="py-6">
                  <EmptyState 
                    type="todos" 
                    onInitialize={initializeSampleData}
                    isLoading={isInitializing}
                  />
                </CardContent>
              </Card>
            )}

            {/* Sample Data Info */}
            {sampleTodoCount > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-orange-800">
                        📚 You have {sampleTodoCount} sample tasks to help you get started
                      </span>
                    </div>
                    <Button
                      onClick={clearSampleData}
                      variant="outline"
                      size="sm"
                      disabled={isClearingSamples}
                      className="text-orange-800 border-orange-300 hover:bg-orange-100"
                    >
                      {isClearingSamples ? 'Clearing...' : 'Clear Samples'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filters */}
            {stats.total > 0 && (
              <Card>
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

                    {stats.completed > 0 && (
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

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-800">{error}</span>
                    <Button
                      onClick={refetch}
                      variant="outline"
                      size="sm"
                      className="text-red-800 border-red-300 hover:bg-red-100"
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Todo List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading tasks...</p>
              </div>
            ) : filteredTodos.length > 0 ? (
              <TodoList
                todos={filteredTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={(id, updates) => {
                  const todo = todos.find((t) => t._id === id);
                  if (!todo) return;
                  const updatedTodo = { ...todo, ...updates };
                  editTodo(
                    id,
                    updatedTodo.title,
                    updatedTodo.description,
                    updatedTodo.priority,
                    updatedTodo.category
                  );
                }}
              />
            ) : stats.total > 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No tasks match the current filter.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
