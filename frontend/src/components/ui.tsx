import type React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("rounded-xl border border-border bg-panel p-5 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl", className)} {...props} />;
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "danger" }) {
  const styles = {
    neutral: "bg-gradient-to-r from-muted to-muted/80 text-foreground shadow-sm",
    good: "bg-gradient-to-r from-accent/20 to-accent/10 text-accent shadow-sm border border-accent/20",
    warn: "bg-gradient-to-r from-warning/25 to-warning/15 text-amber-700 dark:text-amber-200 shadow-sm border border-warning/20",
    danger: "bg-gradient-to-r from-danger/20 to-danger/10 text-danger shadow-sm border border-danger/20"
  };
  return <span className={cn("inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide", styles[tone])}>{children}</span>;
}

export function Meter({ value, label }: { value: number; label: string }) {
  const getColor = (val: number) => {
    if (val >= 80) return "bg-gradient-to-r from-red-500 to-red-600";
    if (val >= 60) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    return "bg-gradient-to-r from-green-500 to-green-600";
  };

  return (
    <div aria-label={label} className="space-y-2">
      <div className="h-3 rounded-full bg-muted/50 overflow-hidden shadow-inner">
        <div 
          className={cn("h-3 rounded-full transition-all duration-500 shadow-sm", getColor(value))} 
          style={{ width: `${Math.min(value, 100)}%` }} 
        />
      </div>
    </div>
  );
}
