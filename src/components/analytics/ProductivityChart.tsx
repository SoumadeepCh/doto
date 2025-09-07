'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import { ProductivityData } from '@/types';

interface ProductivityChartProps {
  data: ProductivityData[];
  isLoading?: boolean;
}

export function ProductivityChart({ data, isLoading }: ProductivityChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Productivity Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; label?: string; payload?: Array<{ value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Created: <span className="font-medium">{payload[0]?.value || 0}</span>
            </p>
            <p className="text-sm text-green-600">
              Completed: <span className="font-medium">{payload[1]?.value || 0}</span>
            </p>
            <p className="text-sm text-purple-600">
              Rate: <span className="font-medium">{payload[2]?.value || 0}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Productivity Trend
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Tasks Created"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--green-600))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--green-600))', strokeWidth: 2, r: 4 }}
                name="Tasks Completed"
              />
              <Line 
                type="monotone" 
                dataKey="completionRate" 
                stroke="hsl(var(--purple-600))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--purple-600))', strokeWidth: 2, r: 4 }}
                name="Completion Rate (%)"
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="created" 
                fill="hsl(var(--primary))" 
                name="Tasks Created"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="completed" 
                fill="hsl(var(--green-600))" 
                name="Tasks Completed"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>

        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No productivity data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
