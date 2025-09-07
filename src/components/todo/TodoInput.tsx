'use client';

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAddTodo: (text: string, description?: string, priority?: string, category?: string) => void;
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <Input
        type="text"
        placeholder="Add a new todo... (e.g., Complete project proposal)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 text-base"
        maxLength={100}
      />
      <Button 
        onClick={handleSubmit}
        disabled={!text.trim()}
        size="default"
        className="px-4"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
