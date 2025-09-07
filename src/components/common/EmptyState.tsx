'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Sparkles, BarChart3 } from 'lucide-react';

interface EmptyStateProps {
  type: 'todos' | 'analytics';
  onInitialize?: () => void;
  isLoading?: boolean;
}

export function EmptyState({ type, onInitialize, isLoading }: EmptyStateProps) {
  if (type === 'todos') {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">All todos completed! 🎉</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Great job! You&apos;ve completed all your todos. Add new ones above to keep your productivity going.
          </p>
          {onInitialize && (
            <>
              <Button 
                onClick={onInitialize}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating sample todos...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Add Sample Todos
                  </div>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will add sample todos to help you explore the features
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === 'analytics') {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No analytics data yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start creating and completing todos to see your productivity analytics. Charts and insights will appear here as you use the app.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground/50">0</div>
              <div className="text-sm text-muted-foreground">Tasks Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground/50">0</div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground/50">0%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
          {onInitialize && (
            <div className="mt-6">
              <Button 
                onClick={onInitialize}
                disabled={isLoading}
                variant="outline"
                className="border-dashed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Creating sample data...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Add Sample Data
                  </div>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
