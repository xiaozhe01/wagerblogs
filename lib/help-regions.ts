import { HelpDirectoryEntries } from "@/collections/HelpDirectoryEntries";
import { ALL_REGIONS } from "@/lib/site-data";

export type HelpRegion = { value: string; label: string };

/** The region chips are the HelpDirectoryEntries.region enum itself, read off
 * the collection rather than mirrored in a second list. A Payload select
 * stores its options in the config, not a table, so this is as close to the
 * source as the field gets — and adding a region to the schema adds its chip
 * with no second edit. */
function schemaRegions(): HelpRegion[] {
  const field = HelpDirectoryEntries.fields.find(
    (entry) => "name" in entry && entry.name === "region",
  );
  if (!field || field.type !== "select") {
    throw new Error("HelpDirectoryEntries.region is no longer a select field");
  }
  return field.options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : { value: String(option.value), label: String(option.label) },
  );
}

export const helpRegions: HelpRegion[] = [
  { value: ALL_REGIONS, label: "All regions" },
  ...schemaRegions(),
];

export const helpRegionValues = helpRegions.map((region) => region.value);

export function helpRegionLabel(value: string) {
  return helpRegions.find((region) => region.value === value)?.label ?? value;
}
