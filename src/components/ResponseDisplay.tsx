'use client';

import React from 'react';
import { Card } from './ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';

interface ResponseDisplayProps {
  response: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export function ResponseDisplay({
  response,
  isLoading = false,
  error = null
}: ResponseDisplayProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Generating response...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Generated Response</h2>
      <Card className="p-6">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {response.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </Card>
    </div>
  );
}
