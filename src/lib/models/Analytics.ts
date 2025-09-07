import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICategoryBreakdown {
  category: string;
  count: number;
}

export interface IAnalytics extends Document {
  _id: string;
  userId: Types.ObjectId;
  date: Date;
  tasksCreated: number;
  tasksCompleted: number;
  productivityScore: number;
  timeSpent: number; // in minutes
  categoryBreakdown: ICategoryBreakdown[];
  createdAt: Date;
  updatedAt: Date;
}

const CategoryBreakdownSchema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  count: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const AnalyticsSchema = new Schema<IAnalytics>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  tasksCreated: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  tasksCompleted: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  productivityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  categoryBreakdown: [CategoryBreakdownSchema],
}, {
  timestamps: true,
});

// Compound index to ensure one analytics record per user per day
AnalyticsSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for efficient querying
AnalyticsSchema.index({ userId: 1, date: -1 });

// Virtual for completion rate
AnalyticsSchema.virtual('completionRate').get(function() {
  if (this.tasksCreated === 0) return 0;
  return Math.round((this.tasksCompleted / this.tasksCreated) * 100);
});

// Method to calculate productivity score
AnalyticsSchema.methods.calculateProductivityScore = function() {
  const completionRate = this.tasksCompleted / (this.tasksCreated || 1);
  const timeEfficiency = Math.min(this.timeSpent / 480, 1); // 480 minutes = 8 hours
  
  // Weighted score: 70% completion rate, 30% time efficiency
  this.productivityScore = Math.round((completionRate * 0.7 + timeEfficiency * 0.3) * 100);
  return this.productivityScore;
};

// Static method to get analytics for a date range
AnalyticsSchema.statics.getAnalyticsRange = function(userId: string, startDate: Date, endDate: Date) {
  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

// Prevent re-compilation during development
const Analytics = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
