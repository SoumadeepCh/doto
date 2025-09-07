'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ApiTest() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string>('');

  const testHealth = async () => {
    setLoading('health');
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setResults(prev => ({ ...prev, health: { success: response.ok, data } }));
    } catch (error) {
      setResults(prev => ({ ...prev, health: { success: false, error: error.message } }));
    }
    setLoading('');
  };

  const testCreateTodo = async () => {
    setLoading('create');
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Todo from Debug Component',
          description: 'This is a test todo',
          priority: 'medium',
          category: 'Test'
        })
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, create: { success: response.ok, data } }));
    } catch (error) {
      setResults(prev => ({ ...prev, create: { success: false, error: error.message } }));
    }
    setLoading('');
  };

  const testFetchTodos = async () => {
    setLoading('fetch');
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setResults(prev => ({ ...prev, fetch: { success: response.ok, data } }));
    } catch (error) {
      setResults(prev => ({ ...prev, fetch: { success: false, error: error.message } }));
    }
    setLoading('');
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Please sign in to test API</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>API Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testHealth} disabled={loading === 'health'}>
            {loading === 'health' ? 'Testing...' : 'Test Health'}
          </Button>
          <Button onClick={testCreateTodo} disabled={loading === 'create'}>
            {loading === 'create' ? 'Creating...' : 'Test Create Todo'}
          </Button>
          <Button onClick={testFetchTodos} disabled={loading === 'fetch'}>
            {loading === 'fetch' ? 'Fetching...' : 'Test Fetch Todos'}
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(results).map(([key, result]: [string, any]) => (
            <div key={key} className="p-4 border rounded">
              <h3 className="font-semibold mb-2">{key.toUpperCase()} Test</h3>
              <div className={`p-2 rounded text-sm ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Status:</strong> {result.success ? 'SUCCESS' : 'FAILED'}<br />
                <strong>Response:</strong>
                <pre className="mt-2 overflow-auto">
                  {JSON.stringify(result.data || result.error, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Session Info</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({ 
              status, 
              userId: session?.user?.id, 
              email: session?.user?.email,
              name: session?.user?.name 
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
