import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <hello@ahmednaik.com>",
      to: "ahmednaik1196@gmail.com",
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: `Resend: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
