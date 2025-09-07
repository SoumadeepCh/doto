export const sampleTodos = [
  {
    title: "🎉 Welcome to your Todo App!",
    description: "This is a sample todo to help you get started. You can delete all sample todos and create your own!",
    priority: "high" as const,
    category: "📚 Sample",
    completed: false,
  },
  {
    title: "✨ Create your first real todo",
    description: "Click the + button above to add your own todos. Delete this sample when ready!",
    priority: "medium" as const,
    category: "📚 Sample",
    completed: false,
  },
  {
    title: "📊 Explore the Analytics Dashboard",
    description: "Click on 'Analytics' in the navigation to see your productivity charts and insights",
    priority: "medium" as const,
    category: "📚 Sample",
    completed: false,
  },
  {
    title: "🏷️ Try organizing with categories",
    description: "Add categories to your todos to better organize your tasks. You can edit or delete this example.",
    priority: "low" as const,
    category: "📚 Sample",
    completed: false,
  },
  {
    title: "📝 Edit todos by clicking the pencil icon",
    description: "Click the pencil icon to edit any todo. This is a sample you can delete.",
    priority: "low" as const,
    category: "📚 Sample",
    completed: false,
  },
  {
    title: "✅ This is a completed sample task",
    description: "Completed tasks show with a strikethrough and can be filtered. Delete when ready!",
    priority: "medium" as const,
    category: "📚 Sample",
    completed: true,
  },
  {
    title: "🎯 High priority sample task",
    description: "This shows how high priority tasks appear. Feel free to delete all sample data!",
    priority: "high" as const,
    category: "📚 Sample",
    completed: true,
  },
  {
    title: "🗑️ Delete sample todos when ready",
    description: "All these sample todos can be deleted. Use the trash icon or 'Clear Completed' button.",
    priority: "low" as const,
    category: "📚 Sample",
    completed: true,
  },
];

export const createSampleTodos = async (userId: string) => {
  const sampleData = sampleTodos.map((todo, index) => ({
    userId,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    priority: todo.priority,
    category: todo.category,
    createdAt: new Date(Date.now() - (sampleTodos.length - index) * 24 * 60 * 60 * 1000), // Spread over past few days
    completedAt: todo.completed ? new Date(Date.now() - (sampleTodos.length - index - 1) * 12 * 60 * 60 * 1000) : undefined,
  }));

  return sampleData;
};
