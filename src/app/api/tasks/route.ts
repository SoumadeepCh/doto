import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/database/connection';
import Task from '@/lib/models/Task';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const category = searchParams.get('category');

    let query: any = { userId: new mongoose.Types.ObjectId(session.user.id) };

    // Apply filters
    if (filter === 'active') {
      query.completed = false;
    } else if (filter === 'completed') {
      query.completed = true;
    }

    if (category) {
      query.category = category;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/tasks - Starting request');
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? { id: session.user?.id, email: session.user?.email } : 'No session');
    
    if (!session?.user?.id) {
      console.log('Unauthorized - no session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, priority, category, dueDate } = await request.json();
    console.log('Request data:', { title, description, priority, category, dueDate });

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectToDatabase();

    const taskData = {
      userId: new mongoose.Types.ObjectId(session.user.id),
      title: title.trim(),
      description: description?.trim(),
      priority: priority || 'medium',
      category: category?.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
    };
    console.log('Creating task with data:', taskData);

    const task = await Task.create(taskData);
    console.log('Task created successfully:', task._id);

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
