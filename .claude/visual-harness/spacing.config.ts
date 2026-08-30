import { defineConfig } from "@playwright/test";

const ROOT = new URL("../..", import.meta.url).pathname;
const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: __dirname,
  testMatch: /spacing-audit\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 120_000,
  use: {
    baseURL,
    contextOptions: { reducedMotion: "reduce" },
  },
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    cwd: ROOT,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
