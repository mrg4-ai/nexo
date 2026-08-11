import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir:"./e2e",
  testIgnore:/pwa\.spec\.ts/,
  fullyParallel:false,
  workers:1,
  timeout:45000,
  retries:0,
  reporter:"line",
  use:{baseURL:"http://127.0.0.1:3300",trace:"retain-on-failure",serviceWorkers:"block"},
  webServer:{command:"pnpm start --hostname 127.0.0.1 --port 3300",url:"http://127.0.0.1:3300",reuseExistingServer:false,timeout:120000},
  projects:[
    {name:"desktop-production",testIgnore:/mobile\.spec\.ts|pwa\.spec\.ts/,use:{...devices["Desktop Chrome"],viewport:{width:1440,height:900}}},
    {name:"mobile-production",testMatch:/mobile\.spec\.ts/,use:{...devices["iPhone 13"],browserName:"chromium",viewport:{width:390,height:844}}},
  ],
});
