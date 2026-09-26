import type { Payload } from "payload";
import { gatherLocks, type Lock } from "@/lib/editing-now";
import NowEditingLive from "./NowEditingLive";
import { Panel } from "./ui";
import { t } from "./strings";

// Server-rendered for the first paint, then the client half polls so a lock
// taken elsewhere shows up without a navigation.
export default async function NowEditing({ payload, lang }: { payload: Payload; lang?: string }) {
  let initial: Lock[] = [];
  try {
    initial = await gatherLocks(payload);
  } catch {
    return null;
  }

  return (
    <Panel title={t("editingNow", lang)} count={initial.length}>
      <NowEditingLive initial={initial} lang={lang} />
    </Panel>
  );
}
