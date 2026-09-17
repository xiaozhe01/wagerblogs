import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { headingConverters } from "./heading";
import { linkConverters } from "./link";

// Defaults carry everything the prose plugin already styles — paragraphs,
// lists, blockquotes, rules, inline code, bold/italic/underline. Only the two
// nodes with a functional requirement are overridden: outbound rel and
// heading anchors.
export const customConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...headingConverters,
  ...linkConverters,
});
