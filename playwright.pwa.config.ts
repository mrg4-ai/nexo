import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir:"./e2e",
  testMatch:/pwa\.spec\.ts/,
  fullyParallel:false,
  workers:1,
  timeout:90000,
  retries:0,
  reporter:"line",
  use:{baseURL:"http://127.0.0.1:3200",trace:"retain-on-failure",serviceWorkers:"allow"},
  webServer:{command:"pnpm start --hostname 127.0.0.1 --port 3200",url:"http://127.0.0.1:3200",reuseExistingServer:false,timeout:120000},
  projects:[{name:"pwa-chromium",use:{...devices["Desktop Chrome"],viewport:{width:1280,height:800}}}],
});
