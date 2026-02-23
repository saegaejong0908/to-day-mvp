#!/usr/bin/env node
/**
 * Ship: commit & push (cross-platform)
 * 변경사항이 없으면 종료, 있으면 add -> commit -> push
 */
const { execSync } = require("child_process");

try {
  const status = execSync("git status --porcelain", { encoding: "utf-8" });
  if (!status.trim()) {
    console.log("변경사항이 없습니다. 종료합니다.");
    process.exit(0);
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .slice(0, 15);

  execSync("git add .", {
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    stdio: ["pipe", "pipe", "pipe"],
  });
  execSync(`git commit -m "update ${timestamp}"`);
  execSync("git push");
  console.log("Ship 완료!");
} catch (e) {
  if (e.status === 0) process.exit(0);
  process.exit(e.status || 1);
}
