import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "../lib/ai/ai-advice-response/auth";
import { logger } from "@/app/lib/logger";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const sessions = new Map<string, any[]>();

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. CALL THIS INSIDE THE POST FUNCTION
    const user = await getAuthUser();
    const firstName = user?.first_name || "user";

    // 2. DEFINE THE ROLE INSIDE SO IT HAS THE NAME
    const role = `
  You are "Buyit", a professional business advisor. 
  The user's name is ${firstName}. Use it to greet them.

  ## THE STRICT HTML RULE
  - **CRITICAL**: NEVER use Markdown symbols like #, **, or []. 
  - **CRITICAL**: If you use ** or #, the system will break. You MUST use <h3> and <strong> instead.
  - **NO WRAPPERS**: Do not wrap your response in \`\`\`html tags. Start directly with <p> or <h3>.

  ## VISUAL STYLE (WHITE TEXT ONLY)
  1. **BODY TEXT**: Use <p style="font-size: 1.1rem; color: white; line-height: 1.6;">
  2. **HEADERS**: Use <h3 style="font-size: 1.3rem; color: white; margin-top: 20px; font-weight: bold;">
  3. **BOLDING**: Use <strong style="color: white;"> to highlight key terms.
  4. **LISTS**: Use <ol style="margin-left: 20px; color: white;"> and <li style="margin-bottom: 15px; font-size: 1.1rem;">.

  ## CONTEXTUAL GREETING
  - If the user says "Hi", respond: <p style="color: white;">Hey ${firstName}! I'm Buyit. What's on your mind?</p>
  - If the user asks a question, jump into the HTML structure.

  ## EXAMPLE FORMAT (MANDATORY)
  <h3>1. Market Strategy</h3>
  <p style="color: white;">Focus on <strong>Brand Positioning</strong> to stand out.</p>
  <ol>
    <li style="color: white;"><strong>Pricing:</strong> Set a premium rate.</li>
  </ol>
  `;

    // Initialize session if it doesn't exist
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, [{ role: "system", content: role }]);
    }

    const history = sessions.get(sessionId)!;
    history.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: history.slice(-20),
      temperature: 0.1,
      max_completion_tokens: 800,
      top_p: 1,
    });

    const reply = completion.choices[0].message.content;
    history.push({ role: "assistant", content: reply });

    return NextResponse.json({ message: reply });
  } catch (error) {
    logger.error("SERVER ERROR", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
