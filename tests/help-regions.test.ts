import assert from "node:assert/strict";
import test from "node:test";
import { HelpDirectoryEntries } from "../collections/HelpDirectoryEntries";
import { helpRegionLabel, helpRegionValues, helpRegions } from "../lib/help-regions";

const regionField = HelpDirectoryEntries.fields.find(
  (entry) => "name" in entry && entry.name === "region",
) as { type: string; options: { label: string; value: string }[] };

test("every schema region becomes a chip", () => {
  for (const option of regionField.options) {
    assert.ok(
      helpRegionValues.includes(option.value),
      `${option.value} is a HelpDirectoryEntries.region option but has no chip`,
    );
  }
});

test("every chip but the sentinel is a schema region", () => {
  const schemaValues = regionField.options.map((option) => option.value);
  for (const value of helpRegionValues.slice(1)) {
    assert.ok(schemaValues.includes(value), `${value} is a chip that no record can hold`);
  }
});

test("the sentinel leads the list and filters nothing", () => {
  assert.equal(helpRegions[0].value, "all");
  assert.equal(helpRegions[0].label, "All regions");
  assert.equal(helpRegions.length, regionField.options.length + 1);
});

test("chip values are the stored values, so the URL needs no translation", () => {
  assert.deepEqual(
    helpRegionValues.slice(1),
    regionField.options.map((option) => option.value),
  );
});

test("an unknown value labels as itself rather than rendering blank", () => {
  assert.equal(helpRegionLabel("north-america"), "North America");
  assert.equal(helpRegionLabel("middle-east-africa"), "Middle East and Africa");
  assert.equal(helpRegionLabel("not-a-region"), "not-a-region");
});
