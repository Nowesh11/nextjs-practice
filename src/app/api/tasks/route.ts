// app/api/tasks/route.ts
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import pusher from "@/lib/pusher";
import openai from '@/lib/openai';
import { taskIndex } from "@/lib/pinecone";


// GET /api/tasks
export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cachedKey = `tasks:${userId}`;
    const cachedTasks = await redis.get(cachedKey);
    if (cachedTasks) {
      return Response.json(
        {
          tasks: cachedTasks,
          fromCache: true
        },
        { status: 200 }
      )
    }

    // ✅ Prisma — no raw SQL
    const tasks = await prisma.task.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
      include: { tags: true }
    });

    await redis.set(cachedKey, tasks, { ex: 60 });



    return Response.json(
      { tasks },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, priority } = await req.json();

    if (!title || title.trim() === '') {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // ✅ Prisma create — clean and type safe
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        priority: priority ?? 'medium',
        userId: Number(userId), // ✅ from middleware
      }
    });

    const embeddingResponse = await openai.embeddings.create({
      input: task.title,
      model: 'text-embedding-3-small'
    });

    const embedding = embeddingResponse.data[0].embedding;

    await taskIndex.upsert({
      records: [
        {
          id: String(task.id),
          values: embedding,
          metadata: {
            title: title,
            userId: String(userId),
          }
        }
      ]
    });

    const cachedKey = `tasks:${userId}`;
    await redis.del(cachedKey);

    await pusher.trigger(
      `tasks-${userId}`,
      'tasks-created',
      { task },
    )

    return Response.json(
      { task },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to add task" },
      { status: 500 }
    );
  }
}