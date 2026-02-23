#!/usr/bin/env node
/**
 * setup-git-vercel: GitHub 저장소 생성, remote 연결, push, Vercel Git 연동 안내
 *
 * 사용법:
 *   1. Windows: winget install GitHub.cli 후 npm run setup:gh-auth
 *   2. 실행: npm run setup:git
 */
const { execSync, spawnSync } = require("child_process");
const path = require("path");

const REPO_NAME = "to-day-mvp";
const isWin = process.platform === "win32";
const GH_BIN = isWin ? "gh" : path.join(__dirname, "..", ".tools", "gh", "bin", "gh");
const cwd = path.resolve(__dirname, "..");

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: "utf-8", cwd, ...opts });
  } catch (e) {
    return null;
  }
}

function main() {
  console.log("=== GitHub + Vercel 설정 ===\n");

  // 1. gh 인증 확인
  const authCheck = run(`${GH_BIN} auth status 2>&1`);
  if (!authCheck || authCheck.includes("not logged in")) {
    console.log("GitHub 로그인이 필요합니다.\n");
    if (isWin) {
      console.log("  1. winget install GitHub.cli");
      console.log("  2. npm run setup:gh-auth\n");
    } else {
      console.log("  npm run setup:gh-auth\n");
    }
    console.log("브라우저에서 로그인 후, npm run setup:git 를 다시 실행하세요.");
    process.exit(1);
  }

  // 2. 이미 remote 있으면 스킵
  const remotes = run("git remote -v");
  if (remotes && remotes.includes("origin")) {
    console.log("origin이 이미 설정되어 있습니다.");
    console.log("푸시만 진행합니다...\n");
    execSync("git push -u origin master", { cwd, stdio: "inherit" });
    console.log("\n완료! Vercel 대시보드에서 Git 연동을 확인하세요.");
    return;
  }

  // 3. gh repo create (없으면 생성)
  console.log("GitHub 저장소 생성/확인 중...");
  const createResult = spawnSync(
    GH_BIN,
    ["repo", "create", REPO_NAME, "--public", "--source=.", "--remote=origin", "--push"],
    { encoding: "utf-8", cwd }
  );

  if (createResult.status !== 0) {
    const err = (createResult.stderr || createResult.stdout || "").trim();
    if (err) console.error("오류:", err);

    const exists = run(`${GH_BIN} repo view ${REPO_NAME} 2>&1`);
    if (exists && !exists.includes("Could not resolve") && !exists.includes("not found")) {
      console.log("\n저장소가 이미 있습니다. remote 추가 및 push...");
      const user = (run(`${GH_BIN} api user -q .login`) || "").trim();
      execSync(`git remote add origin https://github.com/${user}/${REPO_NAME}.git`, { cwd, stdio: "inherit" });
      execSync("git push -u origin master", { cwd, stdio: "inherit" });
    } else {
      console.error("\n저장소 생성 실패. 다음을 확인하세요:");
      console.error("  1. gh auth status  → 로그인 확인");
      console.error("  2. gh auth login   → 로그인 안 되어 있으면 실행");
      process.exit(1);
    }
  }

  const user = (run(`${GH_BIN} api user -q .login`) || "").trim();
  console.log("\n=== 완료 ===");
  console.log("1. GitHub: https://github.com/" + user + "/" + REPO_NAME);
  console.log("2. Vercel 자동 배포: vercel.com 대시보드 → 프로젝트 → Settings → Git");
  console.log("   GitHub 저장소가 연결되어 있으면 push 시 자동 배포됩니다.");
}

main();
