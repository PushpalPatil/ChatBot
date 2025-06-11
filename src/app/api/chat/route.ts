import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o'),
      system: 'You are a helpful assistant.' + 'You use Gen-Z language.' + 'You are concise and ask any necessary questions.',
      messages,
    });

    return result.toDataStreamResponse();
  }
  catch (error){
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', {status: 500});
  } 
}