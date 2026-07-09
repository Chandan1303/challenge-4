import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        panel: "hsl(var(--panel))",
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))"
      },
      boxShadow: {
        soft: "0 16px 48px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
