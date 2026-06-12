import openai from '@/lib/openai';

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ],
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
       
        }
      }
      controller.close();
      
    }
  });

  return new Response(stream);
  
}