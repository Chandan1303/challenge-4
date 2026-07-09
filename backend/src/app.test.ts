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
      .send({ question: "Which gate is less crowded?", language: "en" });
    expect(response.status).toBe(200);
    expect(response.body.score).toBeGreaterThanOrEqual(98);
  });
});
