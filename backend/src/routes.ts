import { Router } from "express";
import { z } from "zod";
import { scoreDecision } from "@stadiummind/shared";
import { alerts, gates, routes, sustainability, volunteerTasks, stadiums, getStadiumData } from "./data/stadium.js";
import { answerQuestion, buildOperationalDecision } from "./services/aiService.js";

export const api = Router();

api.get("/health", (_req, res) => {
  res.json({ ok: true, service: "StadiumMind AI" });
});

api.get("/stadiums", (_req, res) => {
  res.json(stadiums);
});

api.get("/operations/snapshot", (req, res) => {
  const stadiumId = (req.query.stadium as string) || "metlife";
  const stadiumData = getStadiumData(stadiumId);
  const decision = buildOperationalDecision();
  res.json({
    stadium: stadiumData.stadium,
    gates: stadiumData.gates,
    alerts: stadiumData.alerts,
    routes: stadiumData.routes,
    sustainability: stadiumData.sustainability,
    volunteerTasks: stadiumData.volunteerTasks,
    aiRecommendation: decision,
    score: scoreDecision(decision)
  });
});

api.post("/assistant", async (req, res, next) => {
  try {
    const body = z.object({
      question: z.string().min(2).max(600),
      language: z.enum(["en", "es", "fr", "hi", "ar", "pt"]).default("en"),
      stadium: z.string().optional()
    }).parse(req.body);
    res.json(await answerQuestion(body.question, body.language));
  } catch (error) {
    next(error);
  }
});

api.get("/accuracy", (_req, res) => {
  const decision = buildOperationalDecision();
  const score = scoreDecision(decision);
  res.json({
    score,
    threshold: 98,
    passed: score >= 98,
    rubric: "Completeness, confidence, evidence sources, and stadium-specific operational detail."
  });
});
