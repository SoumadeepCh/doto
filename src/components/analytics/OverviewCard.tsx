'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, CheckCircle, Flame, Clock, BarChart3 } from 'lucide-react';

interface OverviewData {
  tasksCreated: number;
  tasksCompleted: number;
  activeTasks: number;
  completionRate: number;
  streak: number;
  averagePerDay: number;
}

interface OverviewCardProps {
  data: OverviewData;
  isLoading?: boolean;
}

export function OverviewCard({ data, isLoading }: OverviewCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-6 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: 'Tasks Created',
      value: data.tasksCreated,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Tasks Completed',
      value: data.tasksCompleted,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Active Tasks',
      value: data.activeTasks,
      icon: Target,
      color: 'text-orange-600',
    },
    {
      label: 'Completion Rate',
      value: `${data.completionRate}%`,
      icon: BarChart3,
      color: 'text-purple-600',
    },
    {
      label: 'Current Streak',
      value: `${data.streak} days`,
      icon: Flame,
      color: 'text-red-600',
    },
    {
      label: 'Daily Average',
      value: data.averagePerDay,
      icon: Clock,
      color: 'text-indigo-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Overview Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  {metric.label}
                </div>
                <div className="text-2xl font-bold">
                  {metric.value}
                </div>
              </div>
            );
          })}
        </div>
        
        {data.completionRate >= 80 && (
          <div className="mt-4 pt-4 border-t">
            <Badge variant="default" className="bg-green-100 text-green-800">
              🎉 Excellent productivity!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
