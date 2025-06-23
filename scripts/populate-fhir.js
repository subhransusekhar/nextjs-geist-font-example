const axios = require('axios');

const FHIR_SERVER_URL = 'http://172.17.0.3:8080/fhir';

const samplePatients = [
  {
    resourceType: "Patient",
    name: [{ 
      use: "official",
      family: "Smith",
      given: ["John"]
    }],
    gender: "male",
    birthDate: "1970-01-01",
    address: [{
      use: "home",
      line: ["123 Main St"],
      city: "Anytown",
      state: "CA",
      postalCode: "12345"
    }]
  },
  {
    resourceType: "Patient",
    name: [{ 
      use: "official",
      family: "Johnson",
      given: ["Sarah"]
    }],
    gender: "female",
    birthDate: "1985-05-15",
    address: [{
      use: "home",
      line: ["456 Oak Ave"],
      city: "Somewhere",
      state: "NY",
      postalCode: "67890"
    }]
  }
];

async function populateFHIRServer() {
  try {
    for (const patient of samplePatients) {
      console.log(`Creating patient: ${patient.name[0].given[0]} ${patient.name[0].family}`);
      
      try {
        const response = await axios.post(
          `${FHIR_SERVER_URL}/Patient`,
          patient,
          {
            headers: {
              'Content-Type': 'application/fhir+json'
            }
          }
        );
        console.log('Patient created successfully:', response.data);
      } catch (error) {
        console.error('Error creating patient:', error.response?.data || error.message);
        console.error('Full error:', error);
      }
    }
    
    console.log('Finished populating FHIR server');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

populateFHIRServer();
