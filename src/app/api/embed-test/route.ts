import openai from '@/lib/openai';

function cosineSimilarity(a: number[], b: number[]){
    const dotProduct = a.reduce((acc, x, i) => acc + x * b[i], 0);
    const aLength = Math.sqrt(a.reduce((acc, x) => acc + x * x, 0));
    const bLength = Math.sqrt(b.reduce((acc, x) => acc + x * x, 0));
    return dotProduct / (aLength * bLength);
}

export async function POST(req: Request){
    try{
        const {text1, text2} = await req.json();
        const embedding1 = await openai.embeddings.create({input: text1, model: 'text-embedding-3-small'});
        const embedding2 = await openai.embeddings.create({input: text2, model: 'text-embedding-3-small'});
        const similarity = cosineSimilarity(embedding1.data[0].embedding, embedding2.data[0].embedding);
        return Response.json({similarity}, {status: 200});
    }catch(error){
        return Response.json({error: 'Failed to calculate similarity'}, {status: 500});
    }
}