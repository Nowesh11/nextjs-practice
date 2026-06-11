import { prisma } from '@/lib/prisma';

// GET all tags for task
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: { id: Number(id), userId: Number(userId) },
      include: { tags: true }
    });

    if (!task) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    return Response.json({ tags: task.tags });

  } catch (error) {
    return Response.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// POST add tag to task
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tagName } = await req.json();

    if (!tagName) {
      return Response.json({ error: 'Tag name required' }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        tags: {
          connectOrCreate: {
            where: { name: tagName },
            create: { name: tagName }
          }
        }
      },
      include: { tags: true }
    });

    return Response.json({ task });

  } catch (error) {
    return Response.json({ error: 'Failed to add tag' }, { status: 500 });
  }
}

// DELETE remove tag from task
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tagName } = await req.json();

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        tags: {
          disconnect: { name: tagName }
        }
      },
      include: { tags: true }
    });

    return Response.json({ task });

  } catch (error) {
    return Response.json({ error: 'Failed to remove tag' }, { status: 500 });
  }
}