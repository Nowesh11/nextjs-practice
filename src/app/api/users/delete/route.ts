import {prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
    try {
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const deleteUser = await prisma.$transaction([

            prisma.task.deleteMany({
                where:{userId: Number(userId)}
            }),

            prisma.profile.deleteMany({
                where:{userId: Number(userId)}
            }),

            prisma.user.delete({
                where:{id: Number(userId)}
            })

        ])

        return Response.json(
            { message: 'User deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }        
}
        