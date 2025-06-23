import axios from 'axios';

export interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  id?: string;
  entry?: Array<{
    resource: FHIRResource;
  }>;
  total?: number;
}

export type FHIRResponse = FHIRBundle | FHIRResource;

const FHIR_SERVER_URL = '/api/fhir';

export class FHIRService {
  private static instance: FHIRService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = FHIR_SERVER_URL;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  }

  public static getInstance(): FHIRService {
    if (!FHIRService.instance) {
      FHIRService.instance = new FHIRService();
    }
    return FHIRService.instance;
  }

  async searchResource(
    resourceType: string,
    params: Record<string, string> = {}
  ): Promise<FHIRResource[]> {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}/${resourceType}${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get<FHIRBundle>(url, {
        headers: {
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        withCredentials: false
      });
      const bundle = response.data;
      
      if (bundle.entry && Array.isArray(bundle.entry)) {
        return bundle.entry.map(entry => entry.resource);
      }
      return [];
    } catch (error) {
      console.error('Error fetching FHIR resources:', error);
      throw new Error('Failed to fetch FHIR resources');
    }
  }

  async getResourceById(
    resourceType: string,
    id: string
  ): Promise<FHIRResource> {
    try {
      const response = await axios.get<FHIRResource>(
        `${this.baseUrl}/${resourceType}/${id}`,
        {
          headers: {
            'Accept': 'application/fhir+json',
            'Content-Type': 'application/fhir+json'
          },
          withCredentials: false
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching FHIR resource:', error);
      throw new Error('Failed to fetch FHIR resource');
    }
  }
}

export const fhirService = FHIRService.getInstance();
