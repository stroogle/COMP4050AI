import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function callOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Use a compatible chat model like 'gpt-3.5-turbo'
      messages: [
        { role: 'system', content: 'You read through entire pdf files and create five short questions and two open ended questions with answers form it .Anwsers need to be altleaset 8 minutes long to answer. You say- Please upload a pdf document ' },
        { role: 'user', content: 'Uploads a pdf documet' }
      ],
      max_tokens: 50, // The maximum number of tokens to generate in the response
    });

    // Ensure the response contains choices, and the first choice's message is valid
    if (response.choices && response.choices.length > 0) {
      const message = response.choices[0].message;
      if (message && message.content) {
        console.log('Response:', message.content.trim());
      } else {
        console.log('No valid content in the response from OpenAI');
      }
    } else {
      console.log('No valid response from OpenAI');
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
  }
}

// Call the function to make the API request
callOpenAI();
