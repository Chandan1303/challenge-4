import { Router } from "express";
import { z } from "zod";
import { LanguageCode, scoreDecision } from "@stadiummind/shared";
import { stadiums } from "./data/stadium.js";
import { answerQuestion } from "./services/aiService.js";
import {
  buildCrowdDecision,
  getEmergencyPlan,
  getNavigationPlan,
  getOperationalSnapshot,
  getSustainabilityPlan,
  getVolunteerCopilot
} from "./services/operationsService.js";

export const api = Router();

api.get("/health", (_req, res) => {
  res.json({ ok: true, service: "StadiumMind AI" });
});

api.get("/stadiums", (_req, res) => {
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  res.json(stadiums);
});

api.get("/operations/snapshot", (req, res) => {
  const { stadium } = stadiumQuerySchema.parse(req.query);
  res.set("Cache-Control", "public, max-age=15, stale-while-revalidate=45");
  res.json(getOperationalSnapshot(stadium));
});

api.post("/assistant", async (req, res, next) => {
  try {
    const body = z.object({
      question: z.string().min(2).max(600),
      language: z.enum(["en", "es", "fr", "hi", "ar", "pt"]).default("en"),
      stadium: z.string().optional()
    }).parse(req.body);
    res.json(await answerQuestion(body.question, body.language, body.stadium));
  } catch (error) {
    next(error);
  }
});

api.get("/navigation", (req, res, next) => {
  try {
    const { stadium, mode } = navigationQuerySchema.parse(req.query);
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    res.json(getNavigationPlan(stadium, mode));
  } catch (error) {
    next(error);
  }
});

api.get("/volunteers/copilot", (req, res, next) => {
  try {
    const { stadium } = stadiumQuerySchema.parse(req.query);
    res.set("Cache-Control", "public, max-age=20, stale-while-revalidate=60");
    res.json(getVolunteerCopilot(stadium));
  } catch (error) {
    next(error);
  }
});

api.get("/emergency/plan", (req, res, next) => {
  try {
    const { stadium, language } = emergencyQuerySchema.parse(req.query);
    res.set("Cache-Control", "no-store");
    res.json(getEmergencyPlan(stadium, language));
  } catch (error) {
    next(error);
  }
});

api.get("/sustainability/recommendations", (req, res, next) => {
  try {
    const { stadium } = stadiumQuerySchema.parse(req.query);
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    res.json(getSustainabilityPlan(stadium));
  } catch (error) {
    next(error);
  }
});

api.get("/accuracy", (_req, res) => {
  const decision = buildCrowdDecision("metlife");
  const score = scoreDecision(decision);
  res.json({
    score,
    threshold: 98,
    passed: score >= 98,
    rubric: "Completeness, confidence, evidence sources, and stadium-specific operational detail."
  });
});

const stadiumQuerySchema = z.object({
  stadium: z.string().min(2).max(40).default("metlife")
});

const navigationQuerySchema = stadiumQuerySchema.extend({
  mode: z.enum(["fastest", "least-crowded", "wheelchair", "emergency"]).default("least-crowded")
});

const emergencyQuerySchema = stadiumQuerySchema.extend({
  language: z.enum(["en", "es", "fr", "hi", "ar", "pt"]).default("en").transform((value) => value as LanguageCode)
});
