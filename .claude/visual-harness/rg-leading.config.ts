import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  testMatch: /rg-leading\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  timeout: 300_000,
  reporter: [["list"]],
  use: {
    channel: "chrome",
    headless: false,
    viewport: { width: 1440, height: 900 },
    contextOptions: { reducedMotion: "reduce" },
  },
});
