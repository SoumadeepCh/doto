import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/database/connection';
import Task from '@/lib/models/Task';
import mongoose from 'mongoose';
import type { Session } from 'next-auth';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Delete all tasks with "📚 Sample" category
    const result = await Task.deleteMany({ 
      userId: new mongoose.Types.ObjectId(session.user.id),
      category: "📚 Sample"
    });

    return NextResponse.json({
      message: 'Sample data cleared successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Clear sample data error:', error);
    return NextResponse.json(
      { error: 'Failed to clear sample data' },
      { status: 500 }
    );
  }
}
