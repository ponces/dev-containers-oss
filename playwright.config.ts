import { defineConfig } from "@playwright/test";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch {
  // No .env on CI
}

// Might be set, which would make the launched Electron app run as plain Node.
delete process.env["ELECTRON_RUN_AS_NODE"];

export default defineConfig({
  reporter: process.env["CI"] ? "html" : "list",
  timeout: 240_000,
  expect: {
    timeout: 120_000,
  },
  workers: 1,
  testDir: "tests",
});
