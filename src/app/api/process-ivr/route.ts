import OpenAI from "openai";
import { twiml } from "twilio";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const formData = await req.formData();
  const recordingUrl = formData.get("RecordingUrl") as string;

  // Fetch transcription from Twilio
  const response = await fetch(`${recordingUrl}.json`, {
    headers: {
      Authorization: `Basic ${btoa(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      )}`,
    },
  });

  const { transcription } = await response.json();

  // Send transcription to OpenAI
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "You are an AI-powered IVR assistant." },
      { role: "user", content: transcription },
    ],
  });

  // Generate Twilio voice response
  const twimlResponse = new twiml.VoiceResponse();
  const reply =
    aiResponse.choices[0].message.content ||
    "I'm sorry, I didn't understand that. Can you please try again?";
  twimlResponse.say(reply);
  twimlResponse.record({ transcribe: true, action: "/api/process-ivr" });

  return new Response(twimlResponse.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
