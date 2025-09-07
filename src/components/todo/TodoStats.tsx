'use client';

import { TodoStats as StatsType } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface TodoStatsProps {
  stats: StatsType;
  onClearCompleted: () => void;
}

export function TodoStats({ stats, onClearCompleted }: TodoStatsProps) {
  const { total, active, completed } = stats;

  if (total === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg mb-2">No todos yet!</p>
        <p className="text-sm">Add your first todo above to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-medium">
            Total: {total}
          </Badge>
          <Badge variant="default" className="font-medium">
            Active: {active}
          </Badge>
          <Badge variant="outline" className="font-medium">
            Completed: {completed}
          </Badge>
        </div>
      </div>

      {completed > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCompleted}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Completed ({completed})
        </Button>
      )}
    </div>
  );
}
