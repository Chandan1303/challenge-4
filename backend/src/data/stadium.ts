import { Alert, GateMetric, NavigationRoute, SustainabilityMetric, VolunteerTask, calculateGateRisk } from "@stadiummind/shared";

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  coordinates: { lat: number; lng: number };
}

export const stadiums: Stadium[] = [
  { id: "metlife", name: "MetLife Stadium", city: "East Rutherford", country: "USA", capacity: 82500, coordinates: { lat: 40.8135, lng: -74.0745 } },
  { id: "atandt", name: "AT&T Stadium", city: "Arlington", country: "USA", capacity: 80000, coordinates: { lat: 32.7473, lng: -97.0945 } },
  { id: "sofi", name: "SoFi Stadium", city: "Inglewood", country: "USA", capacity: 70000, coordinates: { lat: 33.9534, lng: -118.3394 } },
  { id: "lumen", name: "Lumen Field", city: "Seattle", country: "USA", capacity: 68500, coordinates: { lat: 47.5952, lng: -122.3316 } },
  { id: "hardrock", name: "Hard Rock Stadium", city: "Miami Gardens", country: "USA", capacity: 65000, coordinates: { lat: 25.9578, lng: -80.2389 } },
  { id: "arrowhead", name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: 76416, coordinates: { lat: 39.0489, lng: -94.4839 } },
  { id: "lincoln", name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", capacity: 69500, coordinates: { lat: 39.9008, lng: -75.1675 } },
  { id: "nrg", name: "NRG Stadium", city: "Houston", country: "USA", capacity: 72000, coordinates: { lat: 29.6847, lng: -95.4107 } },
  { id: "fordfield", name: "Ford Field", city: "Detroit", country: "USA", capacity: 65000, coordinates: { lat: 42.3401, lng: -83.0458 } },
  { id: "bancali", name: "Banc of California Stadium", city: "Los Angeles", country: "USA", capacity: 22000, coordinates: { lat: 34.0430, lng: -118.2716 } },
  { id: "estadio", name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: 87000, coordinates: { lat: 19.3025, lng: -99.1506 } },
  { id: "bbva", name: "BBVA Stadium", city: "Guadalajara", country: "Mexico", capacity: 49000, coordinates: { lat: 20.7032, lng: -103.3456 } },
  { id: "monterrey", name: "Estadio Monterrey", city: "Monterrey", country: "Mexico", capacity: 53000, coordinates: { lat: 25.6545, lng: -100.3456 } },
  { id: "bmo", name: "BMO Field", city: "Toronto", country: "Canada", capacity: 30000, coordinates: { lat: 43.6333, lng: -79.4189 } },
  { id: "commonwealth", name: "Commonwealth Stadium", city: "Edmonton", country: "Canada", capacity: 56000, coordinates: { lat: 53.5461, lng: -113.4938 } },
  { id: "vancouver", name: "BC Place", city: "Vancouver", country: "Canada", capacity: 54000, coordinates: { lat: 49.2767, lng: -123.1067 } }
];

const stadiumData: Record<string, {
  gates: Omit<GateMetric, "riskScore">[];
  alerts: Alert[];
  routes: NavigationRoute[];
  sustainability: SustainabilityMetric[];
  volunteerTasks: VolunteerTask[];
}> = {
  metlife: {
    gates: [
      { id: "gate-1", name: "Gate 1 North", occupancy: 63, queueMinutes: 11, processingRatePerMinute: 58, incomingFans: 260, trend: "stable" },
      { id: "gate-3", name: "Gate 3 Transit Plaza", occupancy: 91, queueMinutes: 24, processingRatePerMinute: 44, incomingFans: 620, trend: "rising" },
      { id: "gate-5", name: "Gate 5 Family Entry", occupancy: 38, queueMinutes: 6, processingRatePerMinute: 61, incomingFans: 140, trend: "falling" },
      { id: "gate-7", name: "Gate 7 Accessible Entry", occupancy: 55, queueMinutes: 9, processingRatePerMinute: 32, incomingFans: 95, trend: "stable" }
    ],
    alerts: [
      { id: "alert-queue-g3", severity: "high", title: "Queue pressure rising", location: "Gate 3 Transit Plaza", summary: "Three bus arrivals are converging with reduced screening throughput.", recommendedAction: "Redirect standard-entry fans to Gate 5 and assign two volunteers to wayfinding.", confidence: 94 },
      { id: "alert-med-118", severity: "medium", title: "Medical response requested", location: "Section 118", summary: "Fan reported dizziness near the east concourse stairs.", recommendedAction: "Dispatch Medical Team B and hold stair traffic for 4 minutes.", confidence: 91 }
    ],
    routes: [
      { id: "route-fast-seat", mode: "fastest", from: "Gate 3", to: "Section 118 Row H", durationMinutes: 7, distanceMeters: 420, crowdExposure: 62, accessible: false, steps: ["Enter Gate 3", "Take east concourse", "Use stairwell E2", "Turn right at Section 116"] },
      { id: "route-low-crowd", mode: "least-crowded", from: "Gate 3", to: "Section 118 Row H", durationMinutes: 10, distanceMeters: 510, crowdExposure: 29, accessible: true, steps: ["Enter Gate 5", "Follow family concourse", "Use elevator E5", "Approach Section 118 from north aisle"] },
      { id: "route-wheelchair", mode: "wheelchair", from: "Parking B", to: "Accessible Seating 118A", durationMinutes: 12, distanceMeters: 610, crowdExposure: 24, accessible: true, steps: ["Use Parking B ramp", "Enter Gate 7", "Pass accessible services desk", "Take elevator E7"] }
    ],
    sustainability: [
      { label: "Energy usage", value: 74, unit: "% of match-day target", status: "watch" },
      { label: "Water usage", value: 58, unit: "% of target", status: "good" },
      { label: "Waste sorted", value: 82, unit: "%", status: "good" },
      { label: "Carbon estimate", value: 18.4, unit: "tCO2e", status: "watch" }
    ],
    volunteerTasks: [
      { id: "task-g3", volunteer: "Avery Chen", task: "Guide arriving fans from Gate 3 to Gate 5", priority: "high", location: "Transit Plaza", reason: "Gate 3 queue is predicted to exceed safe thresholds.", etaMinutes: 18 },
      { id: "task-med", volunteer: "Mina Patel", task: "Clear path for Medical Team B", priority: "medium", location: "Section 118", reason: "Medical request near stairs requires temporary flow control.", etaMinutes: 8 }
    ]
  },
  atandt: {
    gates: [
      { id: "gate-a", name: "Gate A Main", occupancy: 72, queueMinutes: 15, processingRatePerMinute: 52, incomingFans: 340, trend: "rising" },
      { id: "gate-c", name: "Gate C Club", occupancy: 45, queueMinutes: 8, processingRatePerMinute: 65, incomingFans: 180, trend: "stable" },
      { id: "gate-e", name: "Gate E East", occupancy: 88, queueMinutes: 22, processingRatePerMinute: 41, incomingFans: 580, trend: "rising" },
      { id: "gate-g", name: "Gate G Accessible", occupancy: 42, queueMinutes: 7, processingRatePerMinute: 35, incomingFans: 85, trend: "falling" }
    ],
    alerts: [
      { id: "alert-crowd-e", severity: "high", title: "High crowd density", location: "Gate E East", summary: "Multiple train arrivals causing congestion at east entrance.", recommendedAction: "Open additional security lanes and redirect to Gate C.", confidence: 92 },
      { id: "alert-parking", severity: "medium", title: "Parking overflow", location: "Lot 3", summary: "Parking Lot 3 reaching capacity, need alternate routing.", recommendedAction: "Direct overflow traffic to Lot 5 with shuttle service.", confidence: 88 }
    ],
    routes: [
      { id: "route-fast-atandt", mode: "fastest", from: "Gate A", to: "Section 204", durationMinutes: 8, distanceMeters: 450, crowdExposure: 58, accessible: false, steps: ["Enter Gate A", "Take main concourse", "Use escalator to 200 level", "Turn left at Section 202"] },
      { id: "route-access-atandt", mode: "least-crowded", from: "Gate C", to: "Section 204", durationMinutes: 12, distanceMeters: 580, crowdExposure: 32, accessible: true, steps: ["Enter Gate C", "Follow club level", "Use elevator C3", "Approach Section 204 from south"] },
      { id: "route-wheelchair-atandt", mode: "wheelchair", from: "Parking 1", to: "Accessible Seating 105", durationMinutes: 14, distanceMeters: 720, crowdExposure: 28, accessible: true, steps: ["Use Parking 1 ramp", "Enter Gate G", "Pass guest services", "Take elevator G2"] }
    ],
    sustainability: [
      { label: "Energy usage", value: 68, unit: "% of match-day target", status: "good" },
      { label: "Water usage", value: 62, unit: "% of target", status: "good" },
      { label: "Waste sorted", value: 78, unit: "%", status: "watch" },
      { label: "Carbon estimate", value: 16.2, unit: "tCO2e", status: "good" }
    ],
    volunteerTasks: [
      { id: "task-parking", volunteer: "James Wilson", task: "Direct overflow traffic to Lot 5", priority: "high", location: "Lot 3 entrance", reason: "Parking capacity reached, need alternate routing.", etaMinutes: 15 },
      { id: "task-gate-e", volunteer: "Sarah Kim", task: "Assist crowd flow at Gate E", priority: "medium", location: "Gate E East", reason: "High crowd density requires additional support.", etaMinutes: 10 }
    ]
  },
  sofi: {
    gates: [
      { id: "gate-1-sofi", name: "Gate 1 Hollywood", occupancy: 58, queueMinutes: 10, processingRatePerMinute: 60, incomingFans: 290, trend: "stable" },
      { id: "gate-3-sofi", name: "Gate 3 Plaza", occupancy: 82, queueMinutes: 18, processingRatePerMinute: 48, incomingFans: 510, trend: "rising" },
      { id: "gate-5-sofi", name: "Gate 5 West", occupancy: 35, queueMinutes: 5, processingRatePerMinute: 64, incomingFans: 120, trend: "falling" },
      { id: "gate-7-sofi", name: "Gate 7 Accessible", occupancy: 48, queueMinutes: 8, processingRatePerMinute: 30, incomingFans: 80, trend: "stable" }
    ],
    alerts: [
      { id: "alert-plaza", severity: "high", title: "Plaza congestion", location: "Gate 3 Plaza", summary: "Concert goers and match fans creating bottleneck at plaza entrance.", recommendedAction: "Separate entry lanes and increase security staff.", confidence: 90 },
      { id: "alert-weather", severity: "medium", title: "Weather advisory", location: "Stadium exterior", summary: "Light rain expected, prepare covered walkways.", recommendedAction: "Deploy additional umbrellas and activate covered routes.", confidence: 95 }
    ],
    routes: [
      { id: "route-fast-sofi", mode: "fastest", from: "Gate 1", to: "Section 315", durationMinutes: 6, distanceMeters: 380, crowdExposure: 55, accessible: false, steps: ["Enter Gate 1", "Take Hollywood concourse", "Use escalator to 300 level", "Turn right at Section 312"] },
      { id: "route-low-sofi", mode: "least-crowded", from: "Gate 5", to: "Section 315", durationMinutes: 11, distanceMeters: 520, crowdExposure: 26, accessible: true, steps: ["Enter Gate 5", "Follow west concourse", "Use elevator W4", "Approach Section 315 from west"] },
      { id: "route-wheelchair-sofi", mode: "wheelchair", from: "Drop-off Zone", to: "Accessible Seating 110", durationMinutes: 10, distanceMeters: 480, crowdExposure: 22, accessible: true, steps: ["Use drop-off zone ramp", "Enter Gate 7", "Pass accessibility desk", "Take elevator A1"] }
    ],
    sustainability: [
      { label: "Energy usage", value: 71, unit: "% of match-day target", status: "watch" },
      { label: "Water usage", value: 55, unit: "% of target", status: "good" },
      { label: "Waste sorted", value: 85, unit: "%", status: "good" },
      { label: "Carbon estimate", value: 15.8, unit: "tCO2e", status: "good" }
    ],
    volunteerTasks: [
      { id: "task-plaza", volunteer: "Maria Garcia", task: "Manage plaza crowd separation", priority: "high", location: "Gate 3 Plaza", reason: "Mixed crowd types creating bottleneck.", etaMinutes: 12 },
      { id: "task-weather", volunteer: "David Chen", task: "Prepare covered walkways", priority: "medium", location: "Stadium exterior", reason: "Incoming rain requires preparation.", etaMinutes: 20 }
    ]
  }
};

// Generate data for remaining stadiums with variations
const generateStadiumData = (stadiumId: string): typeof stadiumData.metlife => {
  const baseGates = [
    { id: `gate-1-${stadiumId}`, name: "Gate 1 North", occupancy: Math.floor(Math.random() * 30) + 40, queueMinutes: Math.floor(Math.random() * 15) + 5, processingRatePerMinute: Math.floor(Math.random() * 20) + 45, incomingFans: Math.floor(Math.random() * 300) + 100, trend: "stable" as const },
    { id: `gate-3-${stadiumId}`, name: "Gate 3 East", occupancy: Math.floor(Math.random() * 30) + 50, queueMinutes: Math.floor(Math.random() * 20) + 10, processingRatePerMinute: Math.floor(Math.random() * 20) + 40, incomingFans: Math.floor(Math.random() * 400) + 200, trend: "rising" as const },
    { id: `gate-5-${stadiumId}`, name: "Gate 5 South", occupancy: Math.floor(Math.random() * 30) + 30, queueMinutes: Math.floor(Math.random() * 10) + 4, processingRatePerMinute: Math.floor(Math.random() * 20) + 55, incomingFans: Math.floor(Math.random() * 200) + 80, trend: "falling" as const },
    { id: `gate-7-${stadiumId}`, name: "Gate 7 Accessible", occupancy: Math.floor(Math.random() * 30) + 35, queueMinutes: Math.floor(Math.random() * 12) + 6, processingRatePerMinute: Math.floor(Math.random() * 15) + 25, incomingFans: Math.floor(Math.random() * 100) + 50, trend: "stable" as const }
  ];

  const baseAlerts = [
    { id: `alert-queue-${stadiumId}`, severity: "high" as const, title: "Queue pressure rising", location: "Gate 3 East", summary: "Increased arrivals causing entry delays.", recommendedAction: "Redirect fans to alternate gates and increase staffing.", confidence: Math.floor(Math.random() * 10) + 85 },
    { id: `alert-med-${stadiumId}`, severity: "medium" as const, title: "Medical standby", location: "Section 105", summary: "Minor injury reported near concession area.", recommendedAction: "Send medical team for assessment.", confidence: Math.floor(Math.random() * 10) + 85 }
  ];

  const baseRoutes = [
    { id: `route-fast-${stadiumId}`, mode: "fastest" as const, from: "Gate 1", to: "Section 205", durationMinutes: Math.floor(Math.random() * 5) + 5, distanceMeters: Math.floor(Math.random() * 200) + 300, crowdExposure: Math.floor(Math.random() * 30) + 40, accessible: false, steps: ["Enter Gate 1", "Take main concourse", "Use escalator to 200 level", "Turn right at destination"] },
    { id: `route-low-${stadiumId}`, mode: "least-crowded" as const, from: "Gate 5", to: "Section 205", durationMinutes: Math.floor(Math.random() * 5) + 10, distanceMeters: Math.floor(Math.random() * 200) + 450, crowdExposure: Math.floor(Math.random() * 20) + 20, accessible: true, steps: ["Enter Gate 5", "Follow south concourse", "Use elevator", "Approach from south aisle"] },
    { id: `route-wheelchair-${stadiumId}`, mode: "wheelchair" as const, from: "Parking", to: "Accessible Seating", durationMinutes: Math.floor(Math.random() * 5) + 10, distanceMeters: Math.floor(Math.random() * 200) + 500, crowdExposure: Math.floor(Math.random() * 15) + 15, accessible: true, steps: ["Use parking ramp", "Enter accessible gate", "Pass services desk", "Take elevator"] }
  ];

  const baseSustainability = [
    { label: "Energy usage", value: Math.floor(Math.random() * 20) + 60, unit: "% of match-day target", status: "watch" as const },
    { label: "Water usage", value: Math.floor(Math.random() * 20) + 50, unit: "% of target", status: "good" as const },
    { label: "Waste sorted", value: Math.floor(Math.random() * 20) + 70, unit: "%", status: "good" as const },
    { label: "Carbon estimate", value: Math.floor(Math.random() * 10) + 12, unit: "tCO2e", status: "watch" as const }
  ];

  const baseVolunteerTasks = [
    { id: `task-1-${stadiumId}`, volunteer: "Volunteer Team A", task: "Assist crowd management", priority: "high" as const, location: "Main entrance", reason: "High traffic volume expected.", etaMinutes: Math.floor(Math.random() * 10) + 10 },
    { id: `task-2-${stadiumId}`, volunteer: "Volunteer Team B", task: "Medical support standby", priority: "medium" as const, location: "Section 105", reason: "Medical alert in area.", etaMinutes: Math.floor(Math.random() * 10) + 5 }
  ];

  return {
    gates: baseGates,
    alerts: baseAlerts,
    routes: baseRoutes,
    sustainability: baseSustainability,
    volunteerTasks: baseVolunteerTasks
  };
};

// Fill in remaining stadiums
stadiums.forEach(stadium => {
  if (!stadiumData[stadium.id]) {
    stadiumData[stadium.id] = generateStadiumData(stadium.id);
  }
});

export const gates: GateMetric[] = stadiumData.metlife.gates.map((gate) => ({ ...gate, riskScore: calculateGateRisk(gate) }));

export const alerts: Alert[] = stadiumData.metlife.alerts;

export const routes: NavigationRoute[] = stadiumData.metlife.routes;

export const sustainability: SustainabilityMetric[] = stadiumData.metlife.sustainability;

export const volunteerTasks: VolunteerTask[] = stadiumData.metlife.volunteerTasks;

// Helper function to get stadium-specific data
export function getStadiumData(stadiumId: string) {
  const data = stadiumData[stadiumId] || stadiumData.metlife;
  return {
    gates: data.gates.map((gate) => ({ ...gate, riskScore: calculateGateRisk(gate) })),
    alerts: data.alerts,
    routes: data.routes,
    sustainability: data.sustainability,
    volunteerTasks: data.volunteerTasks,
    stadium: stadiums.find(s => s.id === stadiumId) || stadiums[0]
  };
}
