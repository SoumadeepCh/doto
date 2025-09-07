'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OverviewCard } from './OverviewCard';
import { ProductivityChart } from './ProductivityChart';
import { CategoryChart } from './CategoryChart';
import { EmptyState } from '../common/EmptyState';
import { Calendar, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  overview: {
    tasksCreated: number;
    tasksCompleted: number;
    activeTasks: number;
    completionRate: number;
    streak: number;
    averagePerDay: number;
  };
  productivity: Array<{
    date: string;
    created: number;
    completed: number;
    completionRate: number;
  }>;
  categories: Array<{
    category: string;
    count: number;
    completed: number;
    completionRate: number;
  }>;
}

export function AnalyticsDashboard() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const fetchAnalytics = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all analytics data in parallel
      const [overviewRes, productivityRes, categoriesRes] = await Promise.all([
        fetch(`/api/analytics?type=overview&days=${selectedPeriod}`),
        fetch(`/api/analytics?type=productivity&days=${selectedPeriod}`),
        fetch(`/api/analytics?type=categories&days=${selectedPeriod}`),
      ]);

      if (!overviewRes.ok || !productivityRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [overview, productivity, categories] = await Promise.all([
        overviewRes.json(),
        productivityRes.json(),
        categoriesRes.json(),
      ]);

      setAnalyticsData({
        overview,
        productivity,
        categories,
      });
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSampleData = async () => {
    if (!session?.user) return;

    setIsInitializing(true);

    try {
      const response = await fetch('/api/user/initialize', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to initialize sample data');
      }

      const data = await response.json();
      
      if (data.initialized) {
        // Refresh analytics after initialization
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Initialize sample data error:', error);
      setError('Failed to create sample data');
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [session, selectedPeriod]);

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Please sign in to view analytics</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const periodOptions = [
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your productivity and task completion patterns
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {periodOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedPeriod === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Check for empty data */}
      {!isLoading && analyticsData && 
        analyticsData.overview.tasksCreated === 0 && 
        analyticsData.overview.tasksCompleted === 0 && 
        analyticsData.overview.activeTasks === 0 ? (
        <EmptyState 
          type="analytics" 
          onInitialize={initializeSampleData}
          isLoading={isInitializing}
        />
      ) : (
        <>
          {/* Overview Cards */}
          <OverviewCard 
            data={analyticsData?.overview || {
              tasksCreated: 0,
              tasksCompleted: 0,
              activeTasks: 0,
              completionRate: 0,
              streak: 0,
              averagePerDay: 0,
            }}
            isLoading={isLoading}
          />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductivityChart 
              data={analyticsData?.productivity || []}
              isLoading={isLoading}
            />
            
            <CategoryChart 
              data={analyticsData?.categories || []}
              isLoading={isLoading}
            />
          </div>

          {/* Insights Card */}
          {analyticsData && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>📈 Insights & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.overview.completionRate >= 80 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="text-green-600">🎯</div>
                      <div>
                        <p className="font-medium text-green-800">Excellent Performance!</p>
                        <p className="text-sm text-green-700">
                          You have a {analyticsData.overview.completionRate}% completion rate. Keep up the great work!
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {analyticsData.overview.streak >= 3 && (
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="text-orange-600">🔥</div>
                      <div>
                        <p className="font-medium text-orange-800">You're on fire!</p>
                        <p className="text-sm text-orange-700">
                          {analyticsData.overview.streak} days streak of completed tasks. Don't break the chain!
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {analyticsData.overview.averagePerDay < 1 && analyticsData.overview.averagePerDay > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-blue-600">💡</div>
                      <div>
                        <p className="font-medium text-blue-800">Room for Growth</p>
                        <p className="text-sm text-blue-700">
                          Consider setting a daily goal of 2-3 tasks to boost productivity.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {analyticsData.categories.length === 0 && (
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="text-purple-600">🏷️</div>
                      <div>
                        <p className="font-medium text-purple-800">Try Categories</p>
                        <p className="text-sm text-purple-700">
                          Add categories to your tasks to better organize and track your work patterns.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
