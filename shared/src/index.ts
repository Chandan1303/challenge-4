export type UserRole = "fan" | "organizer" | "volunteer" | "security";
export type LanguageCode = "en" | "es" | "fr" | "hi" | "ar" | "pt";
export type RouteMode = "fastest" | "least-crowded" | "wheelchair" | "emergency";

export interface GateMetric {
  id: string;
  name: string;
  occupancy: number;
  queueMinutes: number;
  processingRatePerMinute: number;
  incomingFans: number;
  riskScore: number;
  trend: "rising" | "stable" | "falling";
}

export interface Alert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  location: string;
  summary: string;
  recommendedAction: string;
  confidence: number;
}

export interface AiDecision {
  currentSituation: string;
  reasoning: string;
  prediction: string;
  recommendedAction: string;
  confidence: number;
  sources: string[];
}

export interface NavigationRoute {
  id: string;
  mode: RouteMode;
  from: string;
  to: string;
  durationMinutes: number;
  distanceMeters: number;
  crowdExposure: number;
  accessible: boolean;
  steps: string[];
}

export interface SustainabilityMetric {
  label: string;
  value: number;
  unit: string;
  status: "good" | "watch" | "action";
}

export interface VolunteerTask {
  id: string;
  volunteer: string;
  task: string;
  priority: "low" | "medium" | "high";
  location: string;
  reason: string;
  etaMinutes: number;
}

export function calculateGateRisk(gate: Pick<GateMetric, "occupancy" | "queueMinutes" | "incomingFans" | "processingRatePerMinute">): number {
  const queuePressure = Math.min(gate.queueMinutes / 45, 1) * 35;
  const densityPressure = Math.min(gate.occupancy / 100, 1) * 35;
  const arrivalPressure = Math.min(gate.incomingFans / Math.max(gate.processingRatePerMinute * 10, 1), 1) * 30;
  return Math.round(queuePressure + densityPressure + arrivalPressure);
}

export function scoreDecision(decision: AiDecision): number {
  const parts = [
    decision.currentSituation,
    decision.reasoning,
    decision.prediction,
    decision.recommendedAction
  ];
  const completeness = parts.every((part) => part.trim().length >= 24) ? 40 : 25;
  const confidence = decision.confidence >= 80 && decision.confidence <= 99 ? 25 : 15;
  const evidence = decision.sources.length >= 2 ? 20 : 10;
  const specificity = /\d|Gate|Section|Queue|medical|exit|parking/i.test(parts.join(" ")) ? 15 : 8;
  return completeness + confidence + evidence + specificity;
}
