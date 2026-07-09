import { scoreDecision } from "@stadiummind/shared";
import { buildOperationalDecision } from "../services/aiService.js";

const score = scoreDecision(buildOperationalDecision());
console.log(JSON.stringify({ finalAccuracyScore: score, passed: score >= 98 }, null, 2));
if (score < 98) {
  process.exit(1);
}
