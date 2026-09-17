import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import { customConverters } from "./converters";

// disableContainer: the prose wrapper below is the only container this needs.
export function RichText({ data }: { data: SerializedEditorState }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <PayloadRichText data={data} converters={customConverters} disableContainer />
    </div>
  );
}
