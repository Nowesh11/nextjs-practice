import resend from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // ✅ await the send
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: subject,
      html: `<p>${message}</p>`
    });

    return Response.json(
      { message: 'Email sent successfully', id: result.data?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}