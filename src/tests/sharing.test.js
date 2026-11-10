import assert from "node:assert/strict";
import test from "node:test";
import { buildActivityShareData } from "../static/sharing.js";

test("shared links identify the exact activity and omit page query data", () => {
  const name = "Arts & Crafts / 音楽 #1 + 50%";
  const data = buildActivityShareData(
    name,
    "Create with friends.",
    "Monday, 3:00 PM",
    "https://school.example/static/index.html?email=private@example.com#old"
  );
  const url = new URL(data.url);
  assert.equal(url.origin, "https://school.example");
  assert.equal(url.pathname, "/static/index.html");
  assert.equal(url.search, "");
  assert.equal(new URLSearchParams(url.hash.slice(1)).get("activity"), name);
  assert.ok(!JSON.stringify(data).includes("private@example.com"));
});

test("social URLs round-trip special characters without changing the activity link", () => {
  const data = buildActivityShareData(
    "Chess & Games", "Learn & play! #friends", "Friday, 3:00 PM",
    "https://school.example/static/index.html"
  );
  const facebook = new URL(data.links.Facebook);
  assert.equal(facebook.origin, "https://www.facebook.com");
  assert.equal(facebook.searchParams.get("u"), data.url);
  const x = new URL(data.links.X);
  assert.equal(x.origin, "https://twitter.com");
  assert.equal(x.searchParams.get("url"), data.url);
  assert.equal(x.searchParams.get("text"), data.title);
  const whatsapp = new URL(data.links.WhatsApp);
  assert.equal(whatsapp.origin, "https://wa.me");
  assert.equal(whatsapp.searchParams.get("text"), `${data.text}\n${data.url}`);
});

test("shared text contains public details and schedule", () => {
  const data = buildActivityShareData(
    "Chess Club", "Learn chess strategies.", "Tuesday, 3:00 PM - 4:00 PM",
    "https://school.example/"
  );
  assert.equal(data.title, "Chess Club - Mergington High School");
  assert.equal(
    data.text,
    "Join Chess Club at Mergington High School! Learn chess strategies.\nSchedule: Tuesday, 3:00 PM - 4:00 PM"
  );
});

test("sharing another activity replaces an existing activity fragment", () => {
  const first = buildActivityShareData("Chess", "", "", "https://school.example/");
  const second = buildActivityShareData("Art", "", "", first.url);
  assert.equal(new URLSearchParams(new URL(second.url).hash.slice(1)).get("activity"), "Art");
  assert.ok(!second.url.includes("Chess"));
});
