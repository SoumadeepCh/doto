'use client';

import { TodoFilter as FilterType } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

const filters: { key: FilterType; label: string; getCount: (stats: TodoFilterProps['stats']) => number }[] = [
  { key: 'all', label: 'All', getCount: (stats) => stats.total },
  { key: 'active', label: 'Active', getCount: (stats) => stats.active },
  { key: 'completed', label: 'Completed', getCount: (stats) => stats.completed },
];

export function TodoFilter({ currentFilter, onFilterChange, stats }: TodoFilterProps) {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map(({ key, label, getCount }) => {
        const count = getCount(stats);
        const isActive = currentFilter === key;
        
        return (
          <Button
            key={key}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(key)}
            className={cn(
              "relative",
              isActive && "shadow-sm"
            )}
          >
            {label}
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 px-1.5 py-0.5 text-xs",
                isActive ? "bg-primary-foreground text-primary" : "bg-muted"
              )}
            >
              {count}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
