'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useApiTodos } from '@/hooks/useApiTodos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TodoInput } from './TodoInput';
import { TodoFilter } from './TodoFilter';
import { TodoList } from './TodoList';
import { TodoStats } from './TodoStats';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { EmptyState } from '../common/EmptyState';
import { WelcomeBanner } from '../common/WelcomeBanner';
import { SampleDataBanner } from '../common/SampleDataBanner';
import { CheckSquare, BarChart3, LogOut, User, Loader2 } from 'lucide-react';

export function AuthenticatedTodoApp() {
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState<'todos' | 'analytics'>('todos');
  const {
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
    initializeSampleData,
    clearSampleData,
  } = useApiTodos();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckSquare className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Todo App</h2>
            <p className="text-muted-foreground">
              Please sign in to access your todos and analytics
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <a href="/auth/signin">Sign In</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/auth/signup">Create Account</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Todo App</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={currentView === 'todos' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('todos')}
                  size="sm"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Todos
                </Button>
                <Button
                  variant={currentView === 'analytics' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('analytics')}
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {session.user.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-4">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentView === 'todos' ? (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold">
                  <CheckSquare className="h-8 w-8 text-primary" />
                  My Todos
                </CardTitle>
                <p className="text-muted-foreground">
                  Stay organized and productive
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isLoading && hasCheckedForData && stats.total === 0 && (
                  <WelcomeBanner 
                    userName={session.user.name || undefined}
                    onCreateSampleData={initializeSampleData}
                    isCreatingSample={isInitializing}
                  />
                )}
                
                {sampleTodoCount > 0 && (
                  <SampleDataBanner 
                    sampleCount={sampleTodoCount}
                    onClearSamples={clearSampleData}
                    isClearingSamples={isClearingSamples}
                  />
                )}
                
                <TodoInput onAddTodo={addTodo} />
                
                <TodoFilter
                  currentFilter={filter}
                  onFilterChange={setFilter}
                  stats={stats}
                />
                
                {isLoading && (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading todos...</p>
                  </div>
                )}
                
                {!isLoading && hasCheckedForData && stats.total === 0 ? (
                  <EmptyState 
                    type="todos" 
                    onInitialize={initializeSampleData}
                    isLoading={isInitializing}
                  />
                ) : (
                  <TodoList
                    todos={filteredTodos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                )}
                
                <TodoStats
                  stats={stats}
                  onClearCompleted={clearCompleted}
                />
              </CardContent>
            </Card>

            <footer className="text-center text-sm text-muted-foreground mt-8">
              <p>Built with Next.js, MongoDB, and shadcn/ui</p>
            </footer>
          </div>
        ) : (
          <AnalyticsDashboard />
        )}
      </main>
    </div>
  );
}
