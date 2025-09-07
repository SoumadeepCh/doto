import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/database/connection';

export async function GET() {
  try {
    // Check database connection
    await connectToDatabase();
    
    // Check authentication
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      auth: session ? 'authenticated' : 'not authenticated',
      user: session?.user?.id || null,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
