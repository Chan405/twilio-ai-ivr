import { twiml } from "twilio";

export async function POST() {
  const response = new twiml.VoiceResponse();
  response.say("Hello! How can I assist you today?");
  response.record({
    transcribe: true,
    maxLength: 30,
    action: "/api/process-ivr",
  });

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
