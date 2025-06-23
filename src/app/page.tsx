'use client';

import React, { useState } from 'react';
import { QueryInput } from '@/components/QueryInput';
import { FHIRDataDisplay } from '@/components/FHIRDataDisplay';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { useFHIR } from '@/hooks/useFHIR';
import { useVLLM } from '@/hooks/useVLLM';

export default function Home() {
  // State for tracking the current query
  const [currentQuery, setCurrentQuery] = useState<string>('');

  // FHIR hook - we'll fetch Patient resources as an example
  const { 
    data: fhirData, 
    loading: fhirLoading, 
    error: fhirError 
  } = useFHIR('Patient');

  // VLLM hook for generating responses
  const {
    response,
    loading: vllmLoading,
    error: vllmError,
    generate
  } = useVLLM();

  // Handle query submission
  const handleQuerySubmit = async (query: string) => {
    setCurrentQuery(query);
    
    // Create context from FHIR data
    const context = fhirData
      .map(resource => JSON.stringify(resource, null, 2))
      .join('\n\n');
    
    // Generate response using VLLM
    await generate(query, context);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-black text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url('https://images.pexels.com/photos/3184344/pexels-photo-3184344.jpeg')`
          }}
        />
        <div className="relative container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">
            Medical Records RAG Assistant
          </h1>
          <p className="text-xl opacity-90">
            Ask questions about patient records using AI-powered search and analysis
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Left column: Query input and response */}
          <div className="space-y-8">
            <QueryInput 
              onSubmit={handleQuerySubmit}
              isLoading={vllmLoading}
            />
            <ResponseDisplay
              response={response}
              isLoading={vllmLoading}
              error={vllmError}
            />
          </div>

          {/* Right column: FHIR data display */}
          <div>
            <FHIRDataDisplay
              resources={fhirData}
              isLoading={fhirLoading}
              error={fhirError}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
