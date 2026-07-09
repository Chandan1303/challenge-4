"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition, useEffect } from "react";
import { AlertTriangle, Ambulance, Bus, CheckCircle2, Languages, Leaf, Map, Mic, Moon, Navigation, Radio, Route, Send, ShieldAlert, Sun, Users, Volume2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { askAssistant, getSnapshot, getStadiums, Snapshot, Stadium } from "@/lib/api";
import { Badge, Card, Meter } from "@/components/ui";
import { StadiumMap } from "@/components/stadium-map";

const languages = [
  ["en", "English"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["hi", "Hindi"],
  ["ar", "Arabic"],
  ["pt", "Portuguese"]
];

export function Dashboard({ snapshot: initialSnapshot }: { snapshot: Snapshot }) {
  const [question, setQuestion] = useState("Which gate is less crowded and wheelchair-friendly?");
  const [language, setLanguage] = useState("en");
  const [answer, setAnswer] = useState(initialSnapshot.aiRecommendation);
  const [score, setScore] = useState(initialSnapshot.score);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [selectedStadium, setSelectedStadium] = useState(initialSnapshot.stadium);
  const [stadiums, setStadiums] = useState<Stadium[]>([initialSnapshot.stadium]);
  const [isStadiumDropdownOpen, setIsStadiumDropdownOpen] = useState(false);
  const [operatorNotice, setOperatorNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const topRisk = useMemo(() => [...snapshot.gates].sort((a, b) => b.riskScore - a.riskScore)[0], [snapshot.gates]);

  useEffect(() => {
    getStadiums().then(setStadiums);
  }, []);

  useEffect(() => {
    setSnapshot(initialSnapshot);
    setSelectedStadium(initialSnapshot.stadium);
    setAnswer(initialSnapshot.aiRecommendation);
    setScore(initialSnapshot.score);
  }, [initialSnapshot]);

  const handleStadiumChange = async (stadium: Stadium) => {
    setSelectedStadium(stadium);
    setIsStadiumDropdownOpen(false);
    try {
      const newSnapshot = await getSnapshot(stadium.id);
      setSnapshot(newSnapshot);
      setAnswer(newSnapshot.aiRecommendation);
      setScore(newSnapshot.score);
      setOperatorNotice(`${stadium.name} operations loaded`);
    } catch {
      setOperatorNotice("Could not refresh venue data; keeping the current operational snapshot.");
    }
  };

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response = await askAssistant(question, language, selectedStadium.id);
        setAnswer(response);
        setScore(response.score);
      } catch {
        setAnswer(snapshot.aiRecommendation);
      }
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-xl shadow-blue-500/25"
            >
              <ShieldAlert className="text-white" size={24} />
            </motion.div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">FIFA World Cup 2026</p>
              <h1 className="text-xl font-bold sm:text-2xl bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text">StadiumMind AI</h1>
            </div>
          </div>
          <nav aria-label="Primary" className="hidden gap-1 md:flex">
            {["Operations", "Assistant", "Navigation", "Emergency", "Sustainability"].map((item) => (
              <motion.a 
                key={item} 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400" 
                href={`#${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsStadiumDropdownOpen(!isStadiumDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-border/50 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium hover:from-blue-500/20 hover:to-indigo-500/20 transition-all shadow-md"
              >
                <Map size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline font-medium">{selectedStadium.name}</span>
                <ChevronDown size={16} className={`transition-transform text-blue-600 dark:text-blue-400 ${isStadiumDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {isStadiumDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 z-50 max-h-96 overflow-y-auto"
                  >
                    {stadiums.map((stadium, index) => (
                      <motion.button
                        key={stadium.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleStadiumChange(stadium)}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 transition-all border-b border-border/50 last:border-b-0 ${
                          selectedStadium.id === stadium.id ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 font-semibold' : ''
                        }`}
                      >
                        <div className="font-medium">{stadium.name}</div>
                        <div className="text-xs text-foreground/60 mt-1">
                          {stadium.city}, {stadium.country} · {stadium.capacity.toLocaleString()} seats
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
              className="grid size-11 place-items-center rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 transition-all shadow-md"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {!mounted ? (
                <div className="size-5" />
              ) : theme === "dark" ? (
                <Sun size={20} className="text-amber-500" />
              ) : (
                <Moon size={20} className="text-indigo-600" />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5">
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="rounded-2xl border border-border/50 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 p-6 backdrop-blur-xl mb-6 shadow-xl shadow-blue-500/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="grid size-14 place-items-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
              >
                <Map className="text-white" size={28} />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text">{selectedStadium.name}</h2>
                <p className="text-sm text-foreground/70 mt-1">{selectedStadium.city}, {selectedStadium.country} · {selectedStadium.capacity.toLocaleString()} seats</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Badge tone="good">Live Monitoring</Badge>
              </motion.div>
              {operatorNotice ? <Badge tone="neutral">{operatorNotice}</Badge> : null}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <section id="operations" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-4">
              <Metric icon={<Users />} label="Top crowd risk" value={`${topRisk.riskScore}%`} sub={topRisk.name} tone="danger" />
              <Metric icon={<Radio />} label="AI accuracy score" value={`${score}%`} sub="Threshold >= 98%" tone={score >= 98 ? "good" : "danger"} />
              <Metric icon={<Bus />} label="Inbound fans" value="1,115" sub="Next 20 minutes" tone="warn" />
              <Metric icon={<Ambulance />} label="Medical requests" value="2" sub="1 active response" tone="neutral" />
            </motion.div>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="overflow-hidden border-border/50 shadow-xl shadow-blue-500/5">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Users className="text-blue-600 dark:text-blue-400" size={20} />
                    <span className="bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text">Crowd Intelligence</span>
                  </h2>
                  <Badge tone="warn">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                      Live prediction
                    </span>
                  </Badge>
                </div>
                <div className="space-y-3">
                  {snapshot.gates.map((gate, index) => (
                    <motion.div 
                      key={gate.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-xl border border-border/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 p-4 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-base">{gate.name}</p>
                          <p className="text-sm text-foreground/70 mt-1">
                            <span className="font-medium">{gate.queueMinutes} min</span> queue · 
                            <span className="font-medium"> {gate.incomingFans}</span> arriving
                          </p>
                        </div>
                        <Badge tone={gate.riskScore > 75 ? "danger" : gate.riskScore > 55 ? "warn" : "good"}>
                          {gate.riskScore}% risk
                        </Badge>
                      </div>
                      <div className="mt-3"><Meter value={gate.occupancy} label={`${gate.name} occupancy`} /></div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="overflow-hidden border-border/50 shadow-xl shadow-blue-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="text-blue-600 dark:text-blue-400" size={22} />
                  <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text">Stadium Heatmap</h2>
                  <Badge tone="neutral">{selectedStadium.city}</Badge>
                </div>
                <div className="rounded-xl overflow-hidden border border-border/50 shadow-inner">
                  <StadiumMap 
                    stadiumName={selectedStadium.name}
                    coordinates={selectedStadium.coordinates}
                    gates={snapshot.gates}
                  />
                </div>
                <div className="mt-4 rounded-xl border border-border/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="size-2 rounded-full bg-blue-600 dark:bg-blue-400"
                    />
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">AI Recommendation</p>
                  </div>
                  <p className="mt-2 text-sm leading-6">{answer.recommendedAction}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-foreground/65">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-green-500" />
                      Confidence {answer.confidence}%
                    </span>
                    <span>·</span>
                    <span>Sources: {answer.sources.join(", ")}</span>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <aside className="space-y-4">
            <Card id="assistant" className="overflow-hidden bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 border-border/50 shadow-xl shadow-blue-500/5">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg"
                >
                  <Languages size={20} />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text">AI Stadium Assistant</h2>
                  <p className="text-xs text-foreground/60">{selectedStadium.name}</p>
                </div>
              </div>
              <form className="space-y-4" onSubmit={submitQuestion}>
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="language">Language</label>
                  <select 
                    id="language" 
                    className="w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-3 transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" 
                    value={language} 
                    onChange={(event) => setLanguage(event.target.value)}
                  >
                    {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="question">Question</label>
                  <textarea 
                    id="question" 
                    className="min-h-24 w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-3 transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" 
                    value={question} 
                    onChange={(event) => setQuestion(event.target.value)} 
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Reasoning...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Ask AI
                      </>
                    )}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Voice input" 
                    type="button" 
                    className="grid size-12 place-items-center rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 transition-all shadow-md"
                  >
                    <Mic size={18} className="text-blue-600 dark:text-blue-400" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Voice output" 
                    type="button" 
                    className="grid size-12 place-items-center rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 transition-all shadow-md"
                  >
                    <Volume2 size={18} className="text-blue-600 dark:text-blue-400" />
                  </motion.button>
                </div>
              </form>
              <div className="mt-4 rounded-xl border border-border/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 p-4 backdrop-blur-sm space-y-3">
                <div>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Situation
                  </p>
                  <p className="mt-2 text-sm leading-6">{answer.currentSituation}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Reasoning</p>
                  <p className="mt-2 text-sm leading-6">{answer.reasoning}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Prediction</p>
                  <p className="mt-2 text-sm leading-6">{answer.prediction}</p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-border/50 shadow-xl shadow-blue-500/5">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <AlertTriangle className="text-amber-500" size={20} />
                <span className="bg-gradient-to-r from-slate-900 to-amber-500 dark:from-white dark:to-amber-400 bg-clip-text">Live Alerts</span>
              </h2>
              <div className="space-y-3">
                {snapshot.alerts.map((alert, index) => (
                  <motion.div 
                    key={alert.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl border border-border/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/50 dark:to-orange-950/50 p-4 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer"
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-semibold flex items-center gap-2">
                        {alert.severity === "high" ? <ShieldAlert size={16} className="text-red-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                        {alert.title}
                      </p>
                      <Badge tone={alert.severity === "high" ? "danger" : "warn"}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed">{alert.summary}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <section id="navigation" className="mx-auto grid max-w-7xl gap-4 px-4 pb-5 lg:grid-cols-3">
        {snapshot.routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:scale-[1.02] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg"
                >
                  <Route size={20} />
                </motion.div>
                <h2 className="font-bold capitalize text-base bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400 bg-clip-text">{route.mode.replace("-", " ")} route</h2>
              </div>
              <p className="text-sm text-foreground/75 mb-4">{route.from} → {route.to}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge tone="good">
                  <Navigation size={12} className="mr-1" />
                  {route.durationMinutes} min
                </Badge>
                <Badge tone={route.accessible ? "good" : "warn"}>
                  {route.accessible ? "♿ Accessible" : "Stairs"}
                </Badge>
                <Badge>{route.crowdExposure}% crowd</Badge>
              </div>
              <div className="rounded-xl border border-border/50 bg-blue-50/30 dark:bg-blue-950/30 p-3">
                <p className="text-xs font-semibold text-foreground/70 mb-2">ROUTE STEPS</p>
                <ol className="space-y-2 text-sm">
                  {route.steps.map((step, i) => (
                    <li key={step} className="flex gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-600 dark:text-blue-400">{i + 1}</span>
                      <span className="leading-5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 lg:grid-cols-3">
        <Card id="emergency" className="lg:col-span-2 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-amber-500/5 border-border/50 shadow-xl shadow-red-500/5 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="grid size-11 place-items-center rounded-lg bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 text-white shadow-lg"
            >
              <ShieldAlert size={22} />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-red-600 dark:from-white dark:to-red-400 bg-clip-text">Emergency Response</h2>
              <p className="text-xs text-foreground/60">{selectedStadium.name}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { action: "Open Exit E5", status: "pending" },
              { action: "Dispatch Medical Team B", status: "in-progress" },
              { action: "Broadcast in 6 Languages", status: "completed" }
            ].map((item, index) => (
              <motion.button
                key={item.action}
                className="rounded-xl border border-border/50 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/50 dark:to-orange-950/50 p-4 hover:shadow-lg hover:shadow-red-500/10 transition-all text-left"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setOperatorNotice(`${item.action} queued for operations review`)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`shrink-0 ${item.status === "completed" ? "text-green-500" : item.status === "in-progress" ? "text-amber-500" : "text-muted-foreground"}`} size={20} />
                    <p className="text-sm font-semibold leading-tight">{item.action}</p>
                  </div>
                  <Badge tone={item.status === "completed" ? "good" : item.status === "in-progress" ? "warn" : "neutral"}>
                    {item.status === "completed" ? "Done" : item.status === "in-progress" ? "Active" : "Pending"}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
        <Card id="sustainability" className="bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 border-border/50 shadow-xl shadow-green-500/5 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg"
            >
              <Leaf size={20} />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-green-600 dark:from-white dark:to-green-400 bg-clip-text">Sustainability</h2>
              <p className="text-xs text-foreground/60">{selectedStadium.name}</p>
            </div>
          </div>
          <div className="space-y-3">
            {snapshot.sustainability.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/50 dark:to-emerald-950/50 p-3 transition-all hover:shadow-sm hover:shadow-green-500/10 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <Badge tone={item.status === "good" ? "good" : "warn"}>
                  {item.value} {item.unit}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8">
        <Card className="bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5 border-border/50 shadow-xl shadow-amber-500/5 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 text-white shadow-lg"
            >
              <Users size={20} />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-amber-600 dark:from-white dark:to-amber-400 bg-clip-text">Volunteer Copilot</h2>
              <p className="text-xs text-foreground/60">{selectedStadium.name}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {snapshot.volunteerTasks.map((task, index) => (
              <motion.div 
                key={task.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/50 dark:to-orange-950/50 p-4 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="font-semibold flex items-center gap-2">
                    <Users size={16} className="text-blue-600 dark:text-blue-400" />
                    {task.volunteer}
                  </p>
                  <Badge tone={task.priority === "high" ? "danger" : "warn"}>{task.priority}</Badge>
                </div>
                <p className="text-sm mb-3">{task.task}</p>
                <div className="flex items-center gap-2 text-xs text-foreground/65 bg-blue-50/30 dark:bg-blue-950/30 rounded-lg p-2">
                  <Map size={12} className="text-blue-600 dark:text-blue-400" />
                  <span>{task.location}</span>
                  <span>·</span>
                  <span className="font-medium">ETA {task.etaMinutes} min</span>
                </div>
                <p className="mt-2 text-xs text-foreground/60 italic">{task.reason}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: "neutral" | "good" | "warn" | "danger" }) {
  const toneColors = {
    neutral: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    good: "from-green-500/10 to-green-500/5 border-green-500/20",
    warn: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
    danger: "from-red-500/10 to-red-500/5 border-red-500/20"
  };

  return (
    <Card className={`bg-gradient-to-br ${toneColors[tone]} transition-all hover:shadow-lg hover:scale-[1.02]`}>
      <div className="flex items-center justify-between gap-2">
        <div className="grid size-12 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 text-primary shadow-inner">
          {icon}
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-foreground/60">{sub}</p>
    </Card>
  );
}
