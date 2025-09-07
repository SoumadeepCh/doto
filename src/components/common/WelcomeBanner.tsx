'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface WelcomeBannerProps {
  userName?: string;
  onCreateSampleData: () => void;
  isCreatingSample: boolean;
}

export function WelcomeBanner({ userName, onCreateSampleData, isCreatingSample }: WelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Sparkles className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium">Welcome to your Todo App{userName ? `, ${userName}` : ''}! 👋</span>
          <p className="text-sm text-blue-700 mt-1">
            Get started by adding your first todo or create some sample data to explore the features.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={onCreateSampleData}
            disabled={isCreatingSample}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCreatingSample ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-2" />
                Try Sample Data
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="p-1 h-8 w-8 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
