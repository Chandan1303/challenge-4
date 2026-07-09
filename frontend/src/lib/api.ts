import { AiDecision, Alert, GateMetric, NavigationRoute, SustainabilityMetric, VolunteerTask } from "@stadiummind/shared";
import { apiUrl } from "./utils";

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  coordinates: { lat: number; lng: number };
}

export interface Snapshot {
  stadium: Stadium;
  gates: GateMetric[];
  alerts: Alert[];
  routes: NavigationRoute[];
  sustainability: SustainabilityMetric[];
  volunteerTasks: VolunteerTask[];
  aiRecommendation: AiDecision;
  score: number;
}

const demoStadium: Stadium = {
  id: "metlife",
  name: "MetLife Stadium",
  city: "East Rutherford",
  country: "USA",
  capacity: 82500,
  coordinates: { lat: 40.8135, lng: -74.0745 }
};

const demoSnapshot: Snapshot = {
  stadium: demoStadium,
  gates: [
    { id: "gate-1", name: "Gate 1 North", occupancy: 63, queueMinutes: 11, processingRatePerMinute: 58, incomingFans: 260, riskScore: 49, trend: "stable" },
    { id: "gate-3", name: "Gate 3 Transit Plaza", occupancy: 91, queueMinutes: 24, processingRatePerMinute: 44, incomingFans: 620, riskScore: 95, trend: "rising" },
    { id: "gate-5", name: "Gate 5 Family Entry", occupancy: 38, queueMinutes: 6, processingRatePerMinute: 61, incomingFans: 140, riskScore: 31, trend: "falling" },
    { id: "gate-7", name: "Gate 7 Accessible Entry", occupancy: 55, queueMinutes: 9, processingRatePerMinute: 32, incomingFans: 95, riskScore: 47, trend: "stable" }
  ],
  alerts: [
    { id: "alert-queue-g3", severity: "high", title: "Queue pressure rising", location: "Gate 3 Transit Plaza", summary: "Three bus arrivals are converging with reduced screening throughput.", recommendedAction: "Redirect standard-entry fans to Gate 5 and assign two volunteers to wayfinding.", confidence: 94 },
    { id: "alert-med-118", severity: "medium", title: "Medical response requested", location: "Section 118", summary: "Fan reported dizziness near the east concourse stairs.", recommendedAction: "Dispatch Medical Team B and hold stair traffic for 4 minutes.", confidence: 91 }
  ],
  routes: [
    { id: "route-low-crowd", mode: "least-crowded", from: "Gate 3", to: "Section 118 Row H", durationMinutes: 10, distanceMeters: 510, crowdExposure: 29, accessible: true, steps: ["Enter Gate 5", "Follow family concourse", "Use elevator E5", "Approach Section 118 from north aisle"] },
    { id: "route-wheelchair", mode: "wheelchair", from: "Parking B", to: "Accessible Seating 118A", durationMinutes: 12, distanceMeters: 610, crowdExposure: 24, accessible: true, steps: ["Use Parking B ramp", "Enter Gate 7", "Pass accessible services desk", "Take elevator E7"] }
  ],
  sustainability: [
    { label: "Energy usage", value: 74, unit: "% of target", status: "watch" },
    { label: "Water usage", value: 58, unit: "% of target", status: "good" },
    { label: "Waste sorted", value: 82, unit: "%", status: "good" },
    { label: "Carbon estimate", value: 18.4, unit: "tCO2e", status: "watch" }
  ],
  volunteerTasks: [
    { id: "task-g3", volunteer: "Avery Chen", task: "Guide fans from Gate 3 to Gate 5", priority: "high", location: "Transit Plaza", reason: "Gate 3 queue is predicted to exceed safe thresholds.", etaMinutes: 18 }
  ],
  aiRecommendation: {
    currentSituation: "Gate 3 is at 91% occupancy with a 24 minute queue and 620 fans arriving soon.",
    reasoning: "Bus arrivals and slower security screening are creating entry pressure near the transit plaza.",
    prediction: "Gate 3 will reach critical crowd pressure within 14 minutes unless flow is redistributed.",
    recommendedAction: "Redirect standard-entry fans to Gate 5, assign two volunteers, and preserve Gate 7 for accessible access.",
    confidence: 94,
    sources: ["gate-sensors", "route-graph", "volunteer-status"]
  },
  score: 100
};

export async function getStadiums(): Promise<Stadium[]> {
  try {
    const response = await fetch(`${apiUrl}/api/stadiums`, { cache: "no-store" });
    if (!response.ok) throw new Error("Stadiums unavailable");
    return response.json();
  } catch {
    return [demoStadium];
  }
}

export async function getSnapshot(stadiumId?: string): Promise<Snapshot> {
  try {
    const url = stadiumId 
      ? `${apiUrl}/api/operations/snapshot?stadium=${stadiumId}`
      : `${apiUrl}/api/operations/snapshot`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("Snapshot unavailable");
    return response.json();
  } catch {
    return demoSnapshot;
  }
}

export async function askAssistant(question: string, language: string, stadiumId?: string) {
  const response = await fetch(`${apiUrl}/api/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, language, stadium: stadiumId })
  });
  if (!response.ok) throw new Error("Assistant unavailable");
  return response.json() as Promise<AiDecision & { score: number; language: string }>;
}
