import Groq from "groq-sdk";
import { AiDecision, LanguageCode, scoreDecision } from "../types.js";
import { config } from "../config.js";
import { getStadiumData } from "../data/stadium.js";
import { buildCrowdDecision } from "./operationsService.js";

const languageNames: Record<LanguageCode, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  hi: "Hindi",
  ar: "Arabic",
  pt: "Portuguese"
};

export function sanitizePrompt(input: string): string {
  return input.replace(/[<>$`{}]/g, "").replace(/\s+/g, " ").trim().slice(0, 600);
}

function fallbackDecision(question: string, language: LanguageCode, stadiumId: string): AiDecision {
  const stadiumData = getStadiumData(stadiumId);
  const riskiestGate = [...stadiumData.gates].sort((a, b) => b.riskScore - a.riskScore)[0];
  const safestGate = [...stadiumData.gates].sort((a, b) => a.riskScore - b.riskScore)[0];
  const route = stadiumData.routes.find((item) => item.mode === "least-crowded") ?? stadiumData.routes[0];

  return {
    currentSituation: `${stadiumData.stadium.name} is tracking ${riskiestGate.name} at ${riskiestGate.occupancy}% occupancy with a ${riskiestGate.queueMinutes} minute queue and ${riskiestGate.incomingFans} inbound fans.`,
    reasoning: `The question "${question}" maps to venue operations; the safest answer avoids ${riskiestGate.name} and uses live route crowd exposure from ${route.id}.`,
    prediction: `If arrivals continue at the current rate, ${riskiestGate.name} will remain the highest-risk entry while ${safestGate.name} stays available for safer redistribution.`,
    recommendedAction: `Use ${route.mode} routing via ${route.steps.join(", ")}. Staff should redirect standard-entry fans to ${safestGate.name} and preserve accessible lanes.`,
    confidence: language === "en" ? 94 : 91,
    sources: ["gate-sensors", "route-graph", "volunteer-status", "stadium-profile"]
  };
}

export async function answerQuestion(question: string, language: LanguageCode, stadiumId = "metlife"): Promise<AiDecision & { score: number; language: string }> {
  const cleanQuestion = sanitizePrompt(question);
  const stadiumData = getStadiumData(stadiumId);
  const base = fallbackDecision(cleanQuestion, language, stadiumId);

  if (!config.GROQ_API_KEY) {
    return { ...base, score: scoreDecision(base), language: languageNames[language] };
  }

  const groq = new Groq({ apiKey: config.GROQ_API_KEY });
  const prompt = [
    "You are StadiumMind AI for FIFA World Cup 2026 stadium operations.",
    "Analyze the live stadium data and provide operational recommendations.",
    "Never give a generic answer. Tie the answer to the named stadium, gates, routes, accessibility, staffing, and live risk scores.",
    "Return ONLY valid JSON with these exact fields:",
    "- currentSituation (string): describe the current stadium situation",
    "- reasoning (string): explain your analysis",
    "- prediction (string): predict what will happen next",
    "- recommendedAction (string): specific action to take",
    "- confidence (number): confidence score 0-100",
    "- sources (array of strings): data sources used",
    "",
    `Language: ${languageNames[language]}`,
    `Stadium: ${JSON.stringify(stadiumData.stadium)}`,
    `Question: ${cleanQuestion}`,
    `Gate data: ${JSON.stringify(stadiumData.gates)}`,
    `Routes: ${JSON.stringify(stadiumData.routes)}`,
    `Alerts: ${JSON.stringify(stadiumData.alerts)}`,
    `Volunteer tasks: ${JSON.stringify(stadiumData.volunteerTasks)}`
  ].join("\n");

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are StadiumMind AI. Always respond with valid JSON only. No markdown, no code blocks, just raw JSON."
        },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.35,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    }, { signal: AbortSignal.timeout(config.AI_TIMEOUT_MS) });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) throw new Error("No response from Groq");

    const parsed = JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()) as AiDecision;
    return { ...parsed, score: scoreDecision(parsed), language: languageNames[language] };
  } catch {
    return { ...base, score: scoreDecision(base), language: languageNames[language] };
  }
}

export function buildOperationalDecision(): AiDecision {
  return buildCrowdDecision("metlife");
}
