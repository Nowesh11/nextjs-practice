import { prisma } from '@/lib/prisma';

// GET single task
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

    return Response.json({ task });

  } catch (error) {
    return Response.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PUT update task
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, completed } = await req.json();

    const existing = await prisma.task.findFirst({
      where: { id: Number(id), userId: Number(userId) }
    });

    if (!existing) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title: title.trim() }),
        ...(completed !== undefined && { completed })
      }
    });

    return Response.json({ task });

  } catch (error) {
    return Response.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE task
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

    const result = await prisma.task.deleteMany({
      where: { id: Number(id), userId: Number(userId) }
    });

    if (result.count === 0) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    return Response.json({ message: 'Task deleted successfully' });

  } catch (error) {
    return Response.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}