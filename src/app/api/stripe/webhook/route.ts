import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';


export async function POST(req: Request) {
    try {
        const body = await req.text();

        const signature = (await headers()).get('stripe-signature');

        if (!signature) {
            return Response.json(
                { error: 'Missing signature' },
                { status: 400 }
            )
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (error) {
            return Response.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )

        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata?.userId;

            if (userId) {
                await prisma.user.update({
                    where: { id: Number(userId) },
                    data: {
                        isPremium: true,
                        stripeCustomerId: session.customer as string,
                    }
                });
            }
        }
        return Response.json(
            { message: 'Success' },
            { status: 200 }
        )
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}