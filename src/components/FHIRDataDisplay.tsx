'use client';

import React from 'react';
import { Card } from './ui/card';
import { FHIRResource } from '../lib/fhir';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface FHIRDataDisplayProps {
  resources: FHIRResource[];
  isLoading?: boolean;
  error?: string | null;
}

export function FHIRDataDisplay({ 
  resources, 
  isLoading = false, 
  error = null 
}: FHIRDataDisplayProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading FHIR resources...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-destructive">
        <div className="text-destructive">
          <p>Error loading FHIR resources: {error}</p>
        </div>
      </Card>
    );
  }

  if (!resources.length) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          <p>No FHIR resources found</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">FHIR Resources</h2>
      <Accordion type="single" collapsible className="w-full">
        {resources.map((resource, index) => (
          <AccordionItem key={resource.id || index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {resource.resourceType} - {resource.id}
            </AccordionTrigger>
            <AccordionContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{JSON.stringify(resource, null, 2)}</code>
              </pre>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
