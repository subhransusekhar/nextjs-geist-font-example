import { useState, useEffect } from 'react';
import { FHIRResource, fhirService } from '../lib/fhir';

interface UseFHIRResult {
  data: FHIRResource[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFHIR(
  resourceType: string,
  params: Record<string, string> = {}
): UseFHIRResult {
  const [data, setData] = useState<FHIRResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resources = await fhirService.searchResource(resourceType, params);
      setData(resources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching FHIR resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resourceType, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

export function useFHIRResource(
  resourceType: string,
  id: string
): Omit<UseFHIRResult, 'data'> & { data: FHIRResource | null } {
  const [data, setData] = useState<FHIRResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resource = await fhirService.getResourceById(resourceType, id);
      setData(resource);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching FHIR resource');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resourceType, id]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
