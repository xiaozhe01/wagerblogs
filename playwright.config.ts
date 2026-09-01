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
    // Without this, axe can scan mid-fade-in and report a false contrast failure.
    contextOptions: { reducedMotion: "reduce" },
  },
  // Viewport x theme. SideNav (desktop, lg+) and TopHeader (mobile/tablet, below
  // lg) are separate DOM subtrees toggled by CSS display, and axe only evaluates
  // whichever is visible — so both viewports are needed. Theme is driven by
  // colorScheme rather than a fixture: the provider defaults to "system", so
  // prefers-color-scheme is the real code path a visitor hits.
  projects: [
    {
      name: "desktop-light",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        colorScheme: "light",
      },
    },
    {
      name: "desktop-dark",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        colorScheme: "dark",
      },
    },
    {
      name: "mobile-light",
      use: { ...devices["iPhone 13"], colorScheme: "light" },
    },
    {
      name: "mobile-dark",
      use: { ...devices["iPhone 13"], colorScheme: "dark" },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
