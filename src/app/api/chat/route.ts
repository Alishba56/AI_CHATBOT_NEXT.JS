import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const CREATOR_NAME = "**Alishba**";

// Supported model list
const MODEL_OPTIONS = [ "gemini-2.0-flash"];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMsgRaw = messages[messages.length - 1]?.content || "";
    const lastMsg = lastMsgRaw.toLowerCase();

    // 👤 Custom answer
    if (
      ["who created you", "who made you", "who is your creator"].some((q) =>
        lastMsg.includes(q)
      )
    ) {
      return NextResponse.json({ reply: `I was created by ${CREATOR_NAME}.` });
    }

    // 🎙️ If voice command
    if (lastMsg.includes("voice on")) {
      return NextResponse.json({ reply: "🎤 Voice mode enabled!" });
    }

    // 🧠 Try models in sequence
    let reply = null;
    let lastError = null;

    for (const modelName of MODEL_OPTIONS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(lastMsgRaw);
        reply = result.response.text();
        break; // success
      } catch (err: any) {
        lastError = err?.message;
        console.warn(`Model ${modelName} failed:`, lastError);
        continue;
      }
    }

    if (!reply) {
      throw new Error(lastError || "All Gemini models failed.");
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Gemini final error:", err?.message || err);
    return NextResponse.json(
      { reply: "⚠️ Gemini service unavailable or invalid model." },
      { status: 503 }
    );
  }
}
