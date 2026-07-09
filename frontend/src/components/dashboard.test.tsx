import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dashboard } from "./dashboard";
import { Snapshot } from "@/lib/api";

const snapshot: Snapshot = {
  gates: [{ id: "g3", name: "Gate 3", occupancy: 91, queueMinutes: 24, processingRatePerMinute: 44, incomingFans: 620, riskScore: 95, trend: "rising" }],
  alerts: [{ id: "a1", severity: "high", title: "Queue pressure rising", location: "Gate 3", summary: "Crowd pressure is rising.", recommendedAction: "Redirect fans.", confidence: 94 }],
  routes: [{ id: "r1", mode: "wheelchair", from: "Parking B", to: "Section 118A", durationMinutes: 12, distanceMeters: 610, crowdExposure: 24, accessible: true, steps: ["Use ramp", "Take elevator"] }],
  sustainability: [{ label: "Waste sorted", value: 82, unit: "%", status: "good" }],
  volunteerTasks: [{ id: "t1", volunteer: "Avery", task: "Guide fans", priority: "high", location: "Gate 3", reason: "Queue risk.", etaMinutes: 18 }],
  aiRecommendation: {
    currentSituation: "Gate 3 is at 91% occupancy with a 24 minute queue.",
    reasoning: "Arrivals are exceeding security processing rate.",
    prediction: "Crowd pressure will become critical within 14 minutes.",
    recommendedAction: "Redirect fans to Gate 5 and send volunteers.",
    confidence: 94,
    sources: ["gate-sensors", "route-graph"]
  },
  score: 100
};

describe("Dashboard", () => {
  it("renders the final score and core modules", () => {
    render(<Dashboard snapshot={snapshot} />);
    expect(screen.getByText("StadiumMind AI")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("AI Stadium Assistant")).toBeInTheDocument();
  });
});
