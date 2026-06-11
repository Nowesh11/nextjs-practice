import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. total tasks count
    // use prisma.task.count()
    const total = await prisma.task.count({
        where:{
            userId: Number(userId)
        }
    });

    // 2. completed tasks count
    // use prisma.task.count() with where: { completed: true }
    const completed = await prisma.task.count({
        where:{
            completed: true,
            userId: Number(userId)

        }
    });

    // 3. incomplete tasks count
    // use prisma.task.count() with where: { completed: false }
    const incomplete = await prisma.task.count({
        where:{
            completed: false,
            userId: Number(userId)
        }
    });

    // 4. tasks by priority
    // use prisma.task.groupBy()

    const byPriority = await prisma.task.groupBy({
        by: ['priority'],
        _count: {id: true},
        where:{
            userId: Number(userId)

        }
    })

    return Response.json({
      total,
      completed,
      incomplete,
      byPriority,
    });

  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}