import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-load Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Checklist & Crisis Plan Generator (for Panic Mode & general planning)
app.post("/api/ai/generate-checklist", async (req, res) => {
  const { situation } = req.body;
  if (!situation) {
    return res.status(400).json({ error: "Situation description is required" });
  }

  try {
    const ai = getAI();
    const prompt = `
You are the "Chief-of-Staff" AI for "Life Saver" — a professional digital assistant designed to help professionals regain control during high-pressure crises.
The user is facing this situation:
"${situation}"

Generate a structured "Panic Plan" in JSON format containing:
1. "steps": An array of 4 sequential, highly actionable steps. Each step should have:
   - "title": Clean action (e.g. "Draft apology email", "Notify development team"). Keep it punchy.
   - "description": Contextual advice (e.g. "To Stakeholders regarding the 2-hour delay").
2. "activeDraft": A professionally written email draft or message to stakeholders, explaining the situation calmly and reassuringly. It should use placeholders like [Your Name], [Company], etc.
3. "focusPrompt": A concise, reassuring motto or deep work guidance (e.g., "Deep work mode enabled. Phone silenced. Focus on the first task only.").
4. "timeToResolution": Recommended countdown time in minutes (e.g. 45 or 60).

Return ONLY a valid JSON object matching this schema:
{
  "steps": [
    { "title": "string", "description": "string" }
  ],
  "activeDraft": "string",
  "focusPrompt": "string",
  "timeToResolution": number
}
Do not include any markdown styling like \`\`\`json or \`\`\`. Just return the raw JSON string.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim() || "{}";
    // Sanitize any potential markdown block wrapped responses
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleanJson);
    res.json(parsed);
  } catch (err: any) {
    console.error("AI Generation Error:", err);
    res.status(500).json({
      error: "Failed to generate AI plan",
      details: err.message,
    });
  }
});

// AI Calendar Suggestion Engine
app.post("/api/ai/suggest-time-blocks", async (req, res) => {
  const { tasks } = req.body; // array of tasks
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: "Active tasks array is required" });
  }

  try {
    const ai = getAI();
    const prompt = `
You are the "Chief-of-Staff" AI scheduling assistant for "Life Saver".
Review these active high-stakes tasks:
${JSON.stringify(tasks, null, 2)}

Suggest 2 optimal, focused calendar time blocks to secure deep-work momentum today.
Return a valid JSON array containing exactly 2 items. Each item must match this schema:
{
  "title": "string (e.g., 'Project Alpha Focus' or 'AI Block: Client Strategy')",
  "start": "string (ISO datetime or hour like '09:00 AM')",
  "end": "string (ISO datetime or hour like '11:00 AM')",
  "type": "ai-focus" | "ai-block",
  "reason": "string (1-2 sentences of professional reasoning, e.g., 'Your peak energy is in the morning. Securing this block protects you from early disruptions.')"
}

Return ONLY a valid JSON array matching this description. Do not include markdown wraps.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim() || "[]";
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleanJson);
    res.json(parsed);
  } catch (err: any) {
    console.error("AI Calendar Block Suggestion Error:", err);
    res.status(500).json({
      error: "Failed to suggest time blocks",
      details: err.message,
    });
  }
});

// AI Refine Draft Engine
app.post("/api/ai/refine-draft", async (req, res) => {
  const { draft, tone } = req.body;
  if (!draft) {
    return res.status(400).json({ error: "Draft text is required" });
  }

  try {
    const ai = getAI();
    const prompt = `
As the "Chief-of-Staff" AI, refine the following text draft to reflect a "${tone || "calm but direct"}" tone of professional elegance.
Original Draft:
"${draft}"

Return ONLY the refined text of the email/message. No conversational preambles, no quotes, no markdown wrappers.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ refined: response.text?.trim() || draft });
  } catch (err: any) {
    console.error("AI Refine Draft Error:", err);
    res.status(500).json({
      error: "Failed to refine draft",
      details: err.message,
    });
  }
});

// Server Initialization
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Life Saver Server] Running on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
