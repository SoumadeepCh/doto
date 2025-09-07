'use client';

import { useState, KeyboardEvent } from 'react';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDisplayDate, isSameDate } from '@/lib/utils/dateUtils';

interface TodoItemProps {
  todo: {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title || '');

  // Safety check for todo data
  if (!todo || !todo._id) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.title);
  };

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== todo.title) {
      onEdit(todo._id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };


  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg border bg-card text-card-foreground transition-colors",
      "hover:shadow-md",
      todo.completed && "opacity-60"
    )}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo._id)}
        className="h-5 w-5"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className="text-base"
            maxLength={100}
            autoFocus
          />
        ) : (
          <div>
            <p className={cn(
              "text-base break-words",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {todo.createdAt && (
                <Badge variant="outline" className="text-xs">
                  Created: {formatDisplayDate(todo.createdAt)}
                </Badge>
              )}
              {todo.updatedAt && todo.createdAt && 
                !isSameDate(todo.updatedAt, todo.createdAt) && (
                <Badge variant="outline" className="text-xs">
                  Updated: {formatDisplayDate(todo.updatedAt)}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
              disabled={todo.completed}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(todo._id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
