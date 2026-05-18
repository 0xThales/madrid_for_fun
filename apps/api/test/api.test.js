import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createApp } from "../src/app.js";

const app = createApp();

async function request(path, options) {
  const response = await app.request(path, options);
  const body = await response.json();

  return { response, body };
}

describe("Madrid For Fun API", () => {
  test("returns health status", async () => {
    const { response, body } = await request("/api/health");

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "madrid-for-fun-api");
  });

  test("returns the OpenAPI spec", async () => {
    const { response, body } = await request("/openapi.json");

    assert.equal(response.status, 200);
    assert.equal(body.openapi, "3.1.0");
    assert.equal(body.info.title, "Madrid For Fun API");
  });

  test("returns metadata for frontend filters", async () => {
    const { response, body } = await request("/api/meta");

    assert.equal(response.status, 200);
    assert.equal(body.name, "Madrid For Fun API");
    assert.equal(body.referenceDate, "2026-05-13");
    assert.ok(body.totalEvents > 0);
    assert.ok(body.categories.length > 0);
    assert.ok(body.districts.length > 0);
  });

  test("lists paginated events", async () => {
    const { response, body } = await request("/api/events?when=week&limit=3");

    assert.equal(response.status, 200);
    assert.equal(body.data.length, 3);
    assert.equal(body.meta.limit, 3);
    assert.ok(body.meta.total >= 3);
  });

  test("returns a single event by id", async () => {
    const list = await request("/api/events?limit=1");
    const eventId = list.body.data[0].id;
    const { response, body } = await request(`/api/events/${eventId}`);

    assert.equal(response.status, 200);
    assert.equal(body.data.id, eventId);
  });

  test("returns 404 for unknown events", async () => {
    const { response, body } = await request("/api/events/999999");

    assert.equal(response.status, 404);
    assert.equal(body.error, "Event not found");
  });

  test("generates plans from a request body", async () => {
    const { response, body } = await request("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: "date",
        when: "weekend",
        district: "Centro",
        categories: ["music", "theater"],
        budget: "any"
      })
    });

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.data));
    assert.equal(body.meta.preferences.mood, "date");
  });
});
