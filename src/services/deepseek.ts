import axios from 'axios';

const DEEPSEEK_API_KEY = 'sk-6e8de9a5036d4f30bf31948b0c7c97eb';
const DEEPSEEK_API_URL = 'https://api.deepseek.ai/v1/completions';

interface DeepSeekResponse {
  code: string;
  explanation: string;
}

export const generateCode = async (prompt: string): Promise<DeepSeekResponse> => {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        prompt: `Generate React/Next.js code for the following requirement:\n${prompt}\nPlease provide the code in a code block with proper comments and explanations.`,
        model: 'deepseek-coder',
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.95,
        stream: false,
        stop: null
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    let content = '';
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      content = response.data.choices[0].text || '';
    }

    // Extract code and explanation
    const codeBlockRegex = /```(?:jsx|tsx|javascript|typescript)?\n([\s\S]*?)```/;
    const codeMatch = content.match(codeBlockRegex);
    
    return {
      code: codeMatch ? codeMatch[1].trim() : content,
      explanation: content.replace(codeBlockRegex, '').trim()
    };
  } catch (error: any) {
    console.error('Error details:', error.response);
    console.error('Error response data:', error.response?.data);
    console.error('Error message:', error.message);
    throw new Error(error.response?.data?.error || 'Failed to generate code');
  }
};
