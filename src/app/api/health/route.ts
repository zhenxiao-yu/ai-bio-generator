import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const groqKeyPresent = !!process.env.GROQ_API_KEY;
  const geminiKeyPresent = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  const providers = {
    groq: groqKeyPresent ? "configured" : "missing_key",
    gemini: geminiKeyPresent ? "configured" : "missing_key",
  };

  const healthy = groqKeyPresent || geminiKeyPresent;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      providers,
      ts: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
