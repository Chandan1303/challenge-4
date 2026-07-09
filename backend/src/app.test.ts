import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("StadiumMind API", () => {
  it("returns an operational snapshot with a passing score", async () => {
    const response = await request(createApp()).get("/api/operations/snapshot");
    expect(response.status).toBe(200);
    expect(response.body.score).toBeGreaterThanOrEqual(98);
  });

  it("answers assistant questions with contextual reasoning", async () => {
    const response = await request(createApp())
      .post("/api/assistant")
      .send({ question: "Which gate is less crowded?", language: "en", stadium: "sofi" });
    expect(response.status).toBe(200);
    expect(response.body.score).toBeGreaterThanOrEqual(98);
    expect(response.body.currentSituation).toMatch(/SoFi|Gate/i);
  });

  it("returns an accessibility-aware navigation plan", async () => {
    const response = await request(createApp()).get("/api/navigation?stadium=metlife&mode=wheelchair");
    expect(response.status).toBe(200);
    expect(response.body.route.accessible).toBe(true);
    expect(response.body.score).toBeGreaterThanOrEqual(98);
  });

  it("returns ranked volunteer copilot tasks", async () => {
    const response = await request(createApp()).get("/api/volunteers/copilot?stadium=metlife");
    expect(response.status).toBe(200);
    expect(response.body.tasks[0].priority).toBe("high");
    expect(response.body.score).toBeGreaterThanOrEqual(98);
  });

  it("returns multilingual emergency response guidance", async () => {
    const response = await request(createApp()).get("/api/emergency/plan?stadium=metlife&language=es");
    expect(response.status).toBe(200);
    expect(response.body.announcement).toContain("Siga");
    expect(response.body.score).toBeGreaterThanOrEqual(98);
  });

  it("returns sustainability recommendations with operational evidence", async () => {
    const response = await request(createApp()).get("/api/sustainability/recommendations?stadium=metlife");
    expect(response.status).toBe(200);
    expect(response.body.metrics.length).toBeGreaterThanOrEqual(4);
    expect(response.body.score).toBeGreaterThanOrEqual(98);
  });

  it("rejects untrusted browser origins", async () => {
    const response = await request(createApp())
      .post("/api/assistant")
      .set("Origin", "https://example.com")
      .send({ question: "Which gate is less crowded?", language: "en" });
    expect(response.status).toBe(403);
  });
});
