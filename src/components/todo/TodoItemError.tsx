'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface TodoItemErrorProps {
  error: Error;
  resetError: () => void;
}

export function TodoItemError({ error, resetError }: TodoItemErrorProps) {
  return (
    <Alert variant="destructive" className="my-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium">Failed to display todo item</span>
          <p className="text-xs mt-1">
            {error.message || 'An error occurred while rendering this todo'}
          </p>
        </div>
        <Button
          onClick={resetError}
          variant="outline"
          size="sm"
          className="ml-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
