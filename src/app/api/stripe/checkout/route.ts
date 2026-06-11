import stripe from '@/lib/stripe';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    // get session directly ✅
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // rest of your checkout code...
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail!,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'TaskApp Premium',
              description: 'Unlimited tasks + priority support',
            },
            unit_amount: 999,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: userId,
      },
    });

    return Response.json({ url: checkoutSession.url });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}