// Task related types
export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string | null;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string | Date | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string | Date | null;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

// Analytics types
export interface OverviewAnalytics {
  tasksCreated: number;
  tasksCompleted: number;
  activeTasks: number;
  completionRate: number;
  streak: number;
  averagePerDay: number;
}

export interface ProductivityData {
  date: string;
  created: number;
  completed: number;
  completionRate: number;
}

export interface CategoryData {
  _id?: string;
  category: string;
  count: number;
  completed: number;
  completionRate: number;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Filter types
export type TaskFilter = 'all' | 'active' | 'completed';

// MongoDB query types
export interface MongoQuery {
  userId: import('mongoose').Types.ObjectId;
  completed?: boolean;
  category?: string;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  completedAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}

// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

// Route params types
export interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Component prop types
export interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: TaskUpdateInput) => void;
}

export interface TodoListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: TaskUpdateInput) => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Form types
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

// Error types
export interface FormError {
  field: string;
  message: string;
}

// Chart component props
export interface AnalyticsChartProps {
  data: ChartData[];
  title: string;
  description?: string;
}

// Hook return types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

// Environment variables types - using default Node.js types

// API test types
export interface ApiTestResult {
  endpoint: string;
  status: 'success' | 'error';
  response?: unknown;
  error?: string;
  timestamp: Date;
}

export interface ApiTestProps {
  onResult: (result: ApiTestResult) => void;
}
