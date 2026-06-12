import openai from '@/lib/openai';
import { prisma } from '@/lib/prisma';

const tools: any = [
    {
        type: 'function',
        function: {
            name: 'addTask',
            description: 'Add a task to your todo list', // ✅ fixed typo
            parameters: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        description: 'The title of the task'
                    },
                    priority: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        description: 'The priority of the task'
                    }
                },
                required: ['title']
            }
        }
    }
];

export async function POST(req: Request) {
    try {
        const userId = req.headers.get('x-user-id');
        const { message } = await req.json();

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. You can add tasks to the todo list.'
                },
                { role: 'user', content: message }
            ],
            tools: tools,
        });

        const aiMessage = response.choices[0].message;

        if (aiMessage.tool_calls) {
            const call = aiMessage.tool_calls[0];

            // ✅ type narrowing — tells TypeScript this IS a function call
            if (call.type === 'function') {
                const functionName = call.function.name;
                const args = JSON.parse(call.function.arguments);

                if (functionName === 'addTask') {
                    const { title } = args;
                    const task = await prisma.task.create({
                        data: { title, userId: Number(userId) }
                    });

                    return Response.json({
                        reply: `✅ Added task: "${task.title}"`,
                        task
                    }, { status: 200 });
                }
            }
        }

        // ✅ normal reply (no function called)
        return Response.json({
            reply: aiMessage.content
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}