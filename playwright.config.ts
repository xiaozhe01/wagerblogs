import { defineConfig, devices } from "@playwright/test";

// Accessibility test suite (tests/a11y/). Runs against a production build, not
// `next dev` — dev mode injects Next's own dev-tools overlay into the DOM, which
// would get scanned along with real app markup and skew results. Port is
// deliberately non-default so this doesn't collide with a dev server already
// running on 3000.
const PORT = 4319;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/a11y",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    // SideNav (desktop, lg+) and TopHeader (mobile/tablet, below lg) are two
    // separate DOM subtrees toggled by CSS display — axe only evaluates whichever
    // is actually visible, so both viewports are needed for full coverage.
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
