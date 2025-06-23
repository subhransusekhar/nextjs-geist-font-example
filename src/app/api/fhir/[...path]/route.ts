import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `http://172.17.0.3:8080/fhir/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json'
      }
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error proxying FHIR request:', error);
    return Response.json(
      { error: 'Failed to fetch FHIR resources' },
      { status: 500 }
    );
  }
}
