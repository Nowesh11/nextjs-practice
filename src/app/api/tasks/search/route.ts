import openai from '@/lib/openai';
import {taskIndex} from '@/lib/pinecone';

export async function POST(req:Request){
    try{
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return Response.json(
              { error: 'Unauthorized' },
              { status: 401 }
            );
        }
        const {query} = await req.json();

        if (!query || query.trim() === '') {
            return Response.json(
              { error: "Query is required" },
              { status: 400 }
            );
        }
        const embedding = await openai.embeddings.create({
            input: query,
            model: 'text-embedding-3-small'
        });
        const results = await taskIndex.query({
            vector:embedding.data[0].embedding,

            topK: 5,

            filter: {userId: String(userId)},

            includeValues: true,
            includeMetadata: true
        });

        return Response.json({results, userId}, {status: 200});
    }catch(error){
        return Response.json({error: 'Failed to search tasks'}, {status: 500});

    }
}