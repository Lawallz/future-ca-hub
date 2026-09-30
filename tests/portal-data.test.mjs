import { test } from "node:test";
import assert from "node:assert/strict";
import { courses, dependentsOf } from "../src/data/roadmap.ts";
import { productInquiry } from "../src/data/products.ts";
test("roadmap contains 37 unique subjects and only earlier-semester prerequisites", () => {
  assert.equal(courses.length, 37);
  assert.equal(new Set(courses.map((c) => c.code)).size, 37);
  for (const course of courses)
    for (const code of course.prerequisites) {
      const parent = courses.find((c) => c.code === code);
      assert.ok(parent);
      assert.ok(parent.semester < course.semester);
    }
  assert.equal(
    courses.reduce((n, c) => n + c.prerequisites.length, 0),
    15,
  );
});
test("diagram relationships do not infer a sequential ENG1 requirement or LPG2 to LPG3", () => {
  assert.deepEqual(courses.find((c) => c.code === "SPOENG2").prerequisites, []);
  assert.deepEqual(courses.find((c) => c.code === "SPOLPG3").prerequisites, ["SPOLPG1"]);
  assert.deepEqual(courses.find((c) => c.code === "SPOPIE1").prerequisites, ["SPOENG3", "SPOLPG2"]);
  assert.deepEqual(
    dependentsOf("SPOPIE1").map((c) => c.code),
    ["SPOPIE2"],
  );
  assert.equal(courses.find((c) => c.code === "SPOLIBR").optional, true);
});
const product = {
  id: "fixture",
  name: "Item & teste",
  description: "Fixture somente para teste",
  priceInCents: 1000,
  available: true,
  options: ["P", "M"],
};
test("product inquiry encodes selection without claiming checkout", () => {
  const url = new URL(productInquiry(product, 2, "M"));
  assert.equal(url.hostname, "wa.me");
  assert.match(url.searchParams.get("text"), /2 unidade\(s\).*Item & teste.*opção: M/);
  assert.match(url.searchParams.get("text"), /confirmar/);
});
test("unavailable items and invalid order selections cannot create an inquiry", () => {
  assert.throws(() => productInquiry({ ...product, available: false }, 1, "M"));
  for (const qty of [0, -1, 1.5, 11, NaN]) assert.throws(() => productInquiry(product, qty, "M"));
  assert.throws(() => productInquiry(product, 1, "G"));
});
