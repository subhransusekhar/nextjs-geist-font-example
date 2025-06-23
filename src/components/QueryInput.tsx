'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';

interface QueryInputProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading?: boolean;
}

export function QueryInput({ onSubmit, isLoading = false }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      await onSubmit(query.trim());
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="query" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enter your query
          </label>
          <Textarea
            id="query"
            placeholder="Ask a question about the medical records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? 'Processing...' : 'Submit Query'}
        </Button>
      </form>
    </Card>
  );
}
