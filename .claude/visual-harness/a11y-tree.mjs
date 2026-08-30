import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/responsible-gambling/help-directory", { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const cdp = await p.context().newCDPSession(p);
await cdp.send("Accessibility.enable");
const { nodes } = await cdp.send("Accessibility.getFullAXTree");
const rows = nodes
  .filter((n) => n.role && ["article"].includes(n.role.value))

  .map((n) => ({
    role: n.role.value,
    name: n.name?.value || "",
    from: n.name?.sources?.find((s) => s.value)?.type || "—",
  }));
console.log("  role        accessible name                                   name comes from");
for (const r of rows.slice(0, 14))
  console.log(`  ${r.role.padEnd(11)} ${("\"" + r.name.slice(0, 44) + "\"").padEnd(48)} ${r.from}`);
await b.close();
