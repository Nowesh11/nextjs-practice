import openai from '@/lib/openai';

export async function POST(req:Request){
    try{
        const {message} = await req.json();

        if(!message){
            return new Response('No message in the request', {status:400});
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],

        });

        const reply = response.choices[0].message.content;

        return Response.json(
            {reply},
            {status:200}
        )
    }catch(error){
        console.log(error);
        return new Response(
            'Failed to generate response',
            {status:500}
        )
    }
}