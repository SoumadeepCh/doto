import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/database/connection';
import Task from '@/lib/models/Task';
import mongoose from 'mongoose';
import { createSampleTodos } from '@/lib/utils/sampleData';
import type { Session } from 'next-auth';

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Check if user already has sample tasks
    const existingSampleCount = await Task.countDocuments({ 
      userId: new mongoose.Types.ObjectId(session.user.id),
      category: '📚 Sample'
    });
    
    if (existingSampleCount > 0) {
      return NextResponse.json({ 
        message: 'User already has sample data',
        initialized: false 
      });
    }

    // Create sample todos
    const sampleData = await createSampleTodos(session.user.id);
    
    // Insert sample todos into database
    const createdTasks = await Task.insertMany(sampleData);

    return NextResponse.json({
      message: 'Sample data initialized successfully',
      initialized: true,
      tasksCreated: createdTasks.length,
    });
  } catch (error) {
    console.error('Initialize sample data error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize sample data' },
      { status: 500 }
    );
  }
}
