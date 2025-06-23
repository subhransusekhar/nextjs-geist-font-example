const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/v1/generate', (req, res) => {
  const { prompt } = req.body;
  
  // Extract the question from the prompt
  const questionMatch = prompt.match(/Question: (.*?)\n\nAnswer:/);
  const question = questionMatch ? questionMatch[1] : '';
  
  // Extract patient data from context
  const contextMatch = prompt.match(/Context: (.*?)\n\nQuestion:/s);
  const context = contextMatch ? contextMatch[1] : '';
  
  let patients = [];
  try {
    // Split context into individual patient records and parse them
    const patientStrings = context.split('\n\n');
    patients = patientStrings.map(str => JSON.parse(str));
  } catch (e) {
    console.error('Error parsing context:', e);
  }

  // Generate a response based on the question and available patient data
  let answer = '';
  if (question.toLowerCase().includes('john smith')) {
    const johnSmith = patients.find(p => 
      p.name?.[0]?.family === 'Smith' && 
      p.name?.[0]?.given?.[0] === 'John'
    );
    if (johnSmith) {
      if (question.toLowerCase().includes('address')) {
        answer += `John Smith's address is ${johnSmith.address[0].line[0]}, ${johnSmith.address[0].city}, ${johnSmith.address[0].state} ${johnSmith.address[0].postalCode}. `;
      }
      if (question.toLowerCase().includes('birth') || question.toLowerCase().includes('dob')) {
        answer += `His date of birth is ${johnSmith.birthDate}.`;
      }
    }
  } else if (question.toLowerCase().includes('sarah johnson')) {
    const sarahJohnson = patients.find(p => 
      p.name?.[0]?.family === 'Johnson' && 
      p.name?.[0]?.given?.[0] === 'Sarah'
    );
    if (sarahJohnson) {
      if (question.toLowerCase().includes('address')) {
        answer += `Sarah Johnson's address is ${sarahJohnson.address[0].line[0]}, ${sarahJohnson.address[0].city}, ${sarahJohnson.address[0].state} ${sarahJohnson.address[0].postalCode}. `;
      }
      if (question.toLowerCase().includes('birth') || question.toLowerCase().includes('dob')) {
        answer += `Her date of birth is ${sarahJohnson.birthDate}.`;
      }
    }
  }

  if (!answer) {
    answer = "I'm sorry, I couldn't find the information you're looking for in the patient records.";
  }

  res.json({
    text: answer,
    usage: {
      prompt_tokens: prompt.length,
      completion_tokens: answer.length,
      total_tokens: prompt.length + answer.length
    }
  });
});

const port = 8081;
app.listen(port, () => {
  console.log(`Mock VLLM server running at http://localhost:${port}`);
});
