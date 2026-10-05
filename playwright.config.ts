import { defineConfig } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
process.env.BINAARE_TEST_DATA ||= mkdtempSync(path.join(tmpdir(), "binaare-test-"));
export default defineConfig({
  testDir: "./tests", timeout: 240000, expect: { timeout: 30000 }, workers: 1, fullyParallel: false,
  use: { baseURL: "http://localhost:3100", channel: "chrome", launchOptions: { args: ["--no-sandbox"] }, trace: "retain-on-failure" },
  webServer: {
    command: "npm run admin:setup && npm run dev -- --port 3100",
    url: "http://localhost:3100/admin", timeout: 180000, reuseExistingServer: false,
    env: { BINAARE_DATA_DIR: process.env.BINAARE_TEST_DATA, BINAARE_DIST_DIR: ".next-test", ADMIN_USERNAME: "test-admin", ADMIN_PASSWORD: "test-password-for-local-tests", ADMIN_CREDENTIALS_FILE: path.join(process.env.BINAARE_TEST_DATA, "credentials"), APP_ORIGIN: "http://localhost:3100" },
  },
});
