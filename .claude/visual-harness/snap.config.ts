import { defineConfig } from "@playwright/test";

const ROOT = new URL("../..", import.meta.url).pathname;
const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: __dirname,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 120_000,
  expect: { toHaveScreenshot: { maxDiffPixels: 0, animations: "disabled" } },
  use: {
    baseURL,
    contextOptions: { reducedMotion: "reduce" },
  },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    cwd: ROOT,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
