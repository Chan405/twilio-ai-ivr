import { NextResponse } from "next/server";
import { Twilio } from "twilio";

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  const { to } = await req.json();

  const call = await twilioClient.calls.create({
    url: "https://your-app.com/api/ivr",
    to,
    from: process.env.TWILIO_PHONE_NUMBER!,
  });

  return NextResponse.json({ success: true, callSid: call.sid });
}
