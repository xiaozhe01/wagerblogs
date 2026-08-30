import { defineConfig } from "@playwright/test";

const PORT = 3000;
export default defineConfig({
  testDir: __dirname,
  testMatch: /rail-cards\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 120_000,
  use: { baseURL: `http://127.0.0.1:${PORT}`, contextOptions: { reducedMotion: "reduce" } },
  webServer: {
    command: `echo reuse`,
    cwd: new URL("../..", import.meta.url).pathname,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
