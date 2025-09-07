import { ApiTest } from '@/components/debug/ApiTest';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Debug Page</h1>
        <ApiTest />
      </div>
    </div>
  );
}
