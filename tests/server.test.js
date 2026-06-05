import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";

describe("Express Server", () => {
  describe("GET /", () => {
    it("should return 200 status", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });

    it("should return HTML content", async () => {
      const res = await request(app).get("/");
      expect(res.headers["content-type"]).toContain("text/html");
    });

    it("should contain calculator title", async () => {
      const res = await request(app).get("/");
      expect(res.text).toContain("Calculator");
    });
  });

  describe("GET /index.html", () => {
    it("should return 200 status", async () => {
      const res = await request(app).get("/index.html");
      expect(res.status).toBe(200);
    });
  });

  describe("Static Assets", () => {
    it("should serve CSS files", async () => {
      const res = await request(app).get("/assets/css/styles.css");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("text/css");
    });

    it("should serve JavaScript files", async () => {
      const res = await request(app).get("/assets/js/script.js");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("javascript");
    });
  });

  describe("GET /health", () => {
    it("should return 200 with status ok", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });

  describe("404 Handling", () => {
    it("should return 404 for non-existent routes", async () => {
      const res = await request(app).get("/nonexistent");
      expect(res.status).toBe(404);
    });

    it("should return 404 for non-existent assets", async () => {
      const res = await request(app).get("/assets/fake.js");
      expect(res.status).toBe(404);
    });
  });
});
