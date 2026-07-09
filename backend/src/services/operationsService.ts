import { AiDecision, LanguageCode, NavigationRoute, VolunteerTask, scoreDecision } from "../types.js";
import { getStadiumData } from "../data/stadium.js";

export function getOperationalSnapshot(stadiumId = "metlife") {
  const stadiumData = getStadiumData(stadiumId);
  const aiRecommendation = buildCrowdDecision(stadiumId);

  return {
    stadium: stadiumData.stadium,
    gates: stadiumData.gates,
    alerts: stadiumData.alerts,
    routes: stadiumData.routes,
    sustainability: stadiumData.sustainability,
    volunteerTasks: stadiumData.volunteerTasks,
    aiRecommendation,
    score: scoreDecision(aiRecommendation)
  };
}

export function buildCrowdDecision(stadiumId = "metlife"): AiDecision {
  const data = getStadiumData(stadiumId);
  const riskiestGate = [...data.gates].sort((a, b) => b.riskScore - a.riskScore)[0];
  const safestGate = [...data.gates].sort((a, b) => a.riskScore - b.riskScore)[0];
  const accessibleRoute = data.routes.find((route) => route.mode === "wheelchair") ?? data.routes.find((route) => route.accessible) ?? data.routes[0];

  return {
    currentSituation: `${data.stadium.name} is monitoring ${riskiestGate.name} at ${riskiestGate.occupancy}% occupancy with a ${riskiestGate.queueMinutes} minute queue.`,
    reasoning: `${riskiestGate.name} has the highest combined pressure because ${riskiestGate.incomingFans} fans are arriving while processing capacity is ${riskiestGate.processingRatePerMinute} fans per minute.`,
    prediction: `Without intervention, ${riskiestGate.name} will exceed safe queue pressure while ${safestGate.name} remains a lower-risk entry point for redistribution.`,
    recommendedAction: `Redirect standard-entry fans from ${riskiestGate.name} to ${safestGate.name}, keep ${accessibleRoute.from} available for accessible routing, and assign volunteers for multilingual wayfinding.`,
    confidence: 94,
    sources: ["gate-sensors", "queue-analytics", "route-graph", "volunteer-status"]
  };
}

export function getNavigationPlan(stadiumId: string, mode: NavigationRoute["mode"] = "least-crowded") {
  const data = getStadiumData(stadiumId);
  const selectedRoute = data.routes.find((route) => route.mode === mode) ?? data.routes.find((route) => route.mode === "least-crowded") ?? data.routes[0];
  const decision: AiDecision = {
    currentSituation: `${selectedRoute.from} to ${selectedRoute.to} currently has ${selectedRoute.crowdExposure}% crowd exposure at ${data.stadium.name}.`,
    reasoning: `The ${selectedRoute.mode} route balances duration, crowd exposure, and accessibility so fans avoid the highest-risk gate pressure.`,
    prediction: `This route should keep movement under ${selectedRoute.durationMinutes} minutes while reducing exposure to congested concourse segments.`,
    recommendedAction: `Use route ${selectedRoute.id}: ${selectedRoute.steps.join(" -> ")}.`,
    confidence: selectedRoute.accessible ? 96 : 91,
    sources: ["route-graph", "crowd-density", "accessibility-map"]
  };

  return { route: selectedRoute, decision, score: scoreDecision(decision) };
}

export function getVolunteerCopilot(stadiumId: string) {
  const data = getStadiumData(stadiumId);
  const rankedTasks = [...data.volunteerTasks].sort((a, b) => priorityWeight(b) - priorityWeight(a));
  const topTask = rankedTasks[0];
  const decision: AiDecision = {
    currentSituation: `${data.stadium.name} has ${rankedTasks.length} active volunteer tasks, with ${topTask.location} carrying the highest operational priority.`,
    reasoning: `${topTask.reason} The task is ranked ${topTask.priority} because it reduces crowd risk or protects emergency access.`,
    prediction: `Completing ${topTask.task} within ${topTask.etaMinutes} minutes should lower pressure around ${topTask.location} before the next arrival wave.`,
    recommendedAction: `Assign ${topTask.volunteer} to ${topTask.task} at ${topTask.location} and confirm completion status with operations control.`,
    confidence: 93,
    sources: ["volunteer-status", "gate-sensors", "incident-queue"]
  };

  return { tasks: rankedTasks, decision, score: scoreDecision(decision) };
}

export function getEmergencyPlan(stadiumId: string, language: LanguageCode = "en") {
  const data = getStadiumData(stadiumId);
  const emergencyRoute = data.routes.find((route) => route.mode === "emergency") ?? data.routes.find((route) => route.accessible) ?? data.routes[0];
  const criticalAlert = data.alerts.find((alert) => alert.severity === "critical" || alert.severity === "high") ?? data.alerts[0];
  const announcements: Record<LanguageCode, string> = {
    en: `Please follow staff instructions and proceed calmly toward ${emergencyRoute.to}.`,
    es: `Siga las instrucciones del personal y avance con calma hacia ${emergencyRoute.to}.`,
    fr: `Suivez les instructions du personnel et avancez calmement vers ${emergencyRoute.to}.`,
    hi: `कृपया स्टाफ के निर्देशों का पालन करें और शांतिपूर्वक ${emergencyRoute.to} की ओर जाएं।`,
    ar: `يرجى اتباع تعليمات الموظفين والتحرك بهدوء نحو ${emergencyRoute.to}.`,
    pt: `Siga as instruções da equipe e avance com calma para ${emergencyRoute.to}.`
  };
  const decision: AiDecision = {
    currentSituation: `${criticalAlert.title} is active near ${criticalAlert.location} at ${data.stadium.name}.`,
    reasoning: `Emergency routing prioritizes accessible corridors, nearest exits, medical team access, and multilingual public announcements.`,
    prediction: `A calm directed movement plan should reduce crowd compression around ${criticalAlert.location} within the next 6 minutes.`,
    recommendedAction: `${criticalAlert.recommendedAction} Broadcast: ${announcements[language]}`,
    confidence: 95,
    sources: ["live-alerts", "route-graph", "medical-dispatch", "translation-catalog"]
  };

  return { route: emergencyRoute, announcement: announcements[language], incident: criticalAlert, decision, score: scoreDecision(decision) };
}

export function getSustainabilityPlan(stadiumId: string) {
  const data = getStadiumData(stadiumId);
  const watchItems = data.sustainability.filter((item) => item.status !== "good");
  const primary = watchItems[0] ?? data.sustainability[0];
  const decision: AiDecision = {
    currentSituation: `${primary.label} at ${data.stadium.name} is ${primary.value} ${primary.unit}, which requires operational monitoring.`,
    reasoning: `Sustainability recommendations combine utility load, waste sorting status, and fan-flow timing so interventions avoid peak ingress pressure.`,
    prediction: `Targeted service adjustments can reduce match-day waste and utility spikes before halftime demand increases.`,
    recommendedAction: `Increase recycling staff near food courts, lower nonessential lighting in low-traffic concourses, and move water refill signage to least-crowded routes.`,
    confidence: 92,
    sources: ["energy-metering", "waste-operations", "crowd-density", "concession-forecast"]
  };

  return { metrics: data.sustainability, recommendations: decision, score: scoreDecision(decision) };
}

function priorityWeight(task: VolunteerTask): number {
  return task.priority === "high" ? 3 : task.priority === "medium" ? 2 : 1;
}
