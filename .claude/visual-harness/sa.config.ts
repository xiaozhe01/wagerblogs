import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: __dirname,
  testMatch: /selfassessment-audit\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  reporter: [["list"]],
  use: { viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: "reduce" } },
});
