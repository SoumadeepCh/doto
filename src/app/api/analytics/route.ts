import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/database/connection';
import Task from '@/lib/models/Task';
import mongoose from 'mongoose';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import type { Session } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const type = searchParams.get('type') || 'overview';

    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);

    if (type === 'overview') {
      // Get overview analytics
      const analytics = await getOverviewAnalytics(session.user.id, startDate, endDate);
      return NextResponse.json(analytics);
    } else if (type === 'productivity') {
      // Get productivity chart data
      const productivity = await getProductivityData(session.user.id, startDate, endDate);
      return NextResponse.json(productivity);
    } else if (type === 'categories') {
      // Get category breakdown
      const categories = await getCategoryBreakdown(session.user.id, startDate, endDate);
      return NextResponse.json(categories);
    }

    return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getOverviewAnalytics(userId: string, startDate: Date, endDate: Date) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  // Get tasks created and completed in the date range
  const tasksCreated = await Task.countDocuments({
    userId: userObjectId,
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const tasksCompleted = await Task.countDocuments({
    userId: userObjectId,
    completedAt: { $gte: startDate, $lte: endDate }
  });

  // Get total active tasks
  const activeTasks = await Task.countDocuments({
    userId: userObjectId,
    completed: false
  });

  // Get completion rate
  const completionRate = tasksCreated > 0 ? Math.round((tasksCompleted / tasksCreated) * 100) : 0;

  // Get streak (consecutive days with completed tasks)
  const streak = await getStreakCount(userId);

  // Get average tasks per day
  const averagePerDay = Math.round((tasksCreated / Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))) * 10) / 10;

  return {
    tasksCreated,
    tasksCompleted,
    activeTasks,
    completionRate,
    streak,
    averagePerDay,
  };
}

async function getProductivityData(userId: string, startDate: Date, endDate: Date) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const data = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    const created = await Task.countDocuments({
      userId: userObjectId,
      createdAt: { $gte: dayStart, $lte: dayEnd }
    });

    const completed = await Task.countDocuments({
      userId: userObjectId,
      completedAt: { $gte: dayStart, $lte: dayEnd }
    });

    data.push({
      date: format(currentDate, 'MMM dd'),
      created,
      completed,
      completionRate: created > 0 ? Math.round((completed / created) * 100) : 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

async function getCategoryBreakdown(userId: string, startDate: Date, endDate: Date) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const pipeline = [
    {
      $match: {
        userId: userObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
        category: { $exists: true, $nin: [null, ''] }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        completed: 1,
        completionRate: {
          $round: [
            { $multiply: [{ $divide: ['$completed', '$count'] }, 100] }
          ]
        }
      }
    },
    { $sort: { count: -1 as const } }
  ];

  const categories = await Task.aggregate(pipeline);
  return categories;
}

async function getStreakCount(userId: string) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  let streak = 0;
  const today = startOfDay(new Date());
  // eslint-disable-next-line prefer-const
  let currentDate = new Date(today);

  while (true) {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    const hasCompletedTask = await Task.countDocuments({
      userId: userObjectId,
      completedAt: { $gte: dayStart, $lte: dayEnd }
    });

    if (hasCompletedTask > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
