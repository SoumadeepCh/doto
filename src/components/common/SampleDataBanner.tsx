'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Trash2, Info } from 'lucide-react';
import { useState } from 'react';

interface SampleDataBannerProps {
  sampleCount: number;
  onClearSamples: () => void;
  isClearingSamples: boolean;
}

export function SampleDataBanner({ sampleCount, onClearSamples, isClearingSamples }: SampleDataBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || sampleCount === 0) return null;

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium">Sample Data Active</span>
          <p className="text-sm text-amber-700 mt-1">
            You have {sampleCount} sample todos to help you explore the app. Delete them individually or clear all at once when ready.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={onClearSamples}
            disabled={isClearingSamples}
            size="sm"
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            {isClearingSamples ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-600 mr-2"></div>
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-3 w-3 mr-2" />
                Clear Samples
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="p-1 h-8 w-8 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
