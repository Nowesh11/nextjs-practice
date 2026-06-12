import {Pinecone} from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
    apiKey:process.env.PINECONE_API_KEY!,
});

export const taskIndex = pinecone.index(process.env.PINECONE_INDEX!);

export default pinecone;