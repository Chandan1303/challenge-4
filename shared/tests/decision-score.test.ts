import { describe, expect, it } from "vitest";
import { calculateGateRisk, scoreDecision } from "../src/index.js";

describe("stadium intelligence scoring", () => {
  it("scores contextual AI decisions above the acceptance threshold", () => {
    expect(scoreDecision({
      currentSituation: "Gate 3 is operating at 91% occupancy with a 24 minute queue.",
      reasoning: "Three supporter buses arrive in 10 minutes while processing speed is below target.",
      prediction: "Queue pressure will exceed safe operating levels near Section 118 within 14 minutes.",
      recommendedAction: "Redirect fans to Gate 5, send two volunteers, and open the accessible lane.",
      confidence: 94,
      sources: ["gate-sensors", "bus-arrivals"]
    })).toBeGreaterThanOrEqual(98);
  });

  it("calculates bounded crowd risk", () => {
    expect(calculateGateRisk({ occupancy: 91, queueMinutes: 24, incomingFans: 620, processingRatePerMinute: 44 })).toBeLessThanOrEqual(100);
  });
});
