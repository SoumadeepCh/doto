'use client';

import { useSession } from 'next-auth/react';
import { AuthenticatedTodoApp } from './AuthenticatedTodoApp';
import { UnauthenticatedTodoApp } from './UnauthenticatedTodoApp';
import { Card, CardContent } from '@/components/ui/card';

export function TodoApp() {
  const { data: session, status } = useSession();

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Route to appropriate app based on authentication status
  if (session?.user) {
    return <AuthenticatedTodoApp />;
  } else {
    return <UnauthenticatedTodoApp />;
  }
}
