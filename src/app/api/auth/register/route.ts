import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        // 1. read name, email, password from request body

        const { name, email, password } = await req.json();

        // 2. validate all fields exist
        if (!name || !email || !password) {
            return Response.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        // 3. check email not already in database

        const existing = await prisma.user.findUnique({
            where: { email }
        }
        );

        if(existing){
            return Response.json(
                { error: 'Email already in use' },
                { status: 400 }
            )
        }

        // 4. hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        // 5. create user in database

        const createUser = await prisma.user.create(
            {
                data:{
                    name,
                    email,
                    password: hashedPassword
                }
            }
        )

        // 6. return success message

        return Response.json(
            { message: 'User created successfully' },
            { status: 201 }
        )

    } catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}