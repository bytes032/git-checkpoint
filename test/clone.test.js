import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, delimiter, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const binPath = fileURLToPath(new URL("../bin/ch", import.meta.url));

function makeTempDir() {
  return fsMkdtemp("git-checkpoint-");
}

function fsMkdtemp(prefix) {
  return mkdirSync(join(tmpdir(), `${prefix}${Date.now()}-${Math.random().toString(16).slice(2)}`), {
    recursive: true,
  });
}

function initRepo(dir) {
  mkdirSync(dir, { recursive: true });
  const init = spawnSync("git", ["init"], { cwd: dir, stdio: "ignore" });
  assert.equal(init.status, 0);
  writeFileSync(join(dir, "README.md"), "test\n");
}

function writeFakeRsync(binDir) {
  const rsyncPath = join(binDir, "rsync");
  const script = `#!/usr/bin/env node
import { appendFileSync, mkdirSync } from "node:fs";
const args = process.argv.slice(2);
const log = process.env.RSYNC_LOG;
if (log) appendFileSync(log, args.join(" ") + "\\n");
if (args[0] === "--info=progress2" && args[1] === "--version") {
  process.exit(process.env.RSYNC_SUPPORTS_INFO === "1" ? 0 : 1);
}
const targetRaw = args[args.length - 1] || "";
const target = targetRaw.endsWith("/") ? targetRaw.slice(0, -1) : targetRaw;
if (target) mkdirSync(target, { recursive: true });
process.exit(0);
`;
  writeFileSync(rsyncPath, script, { mode: 0o755 });
  chmodSync(rsyncPath, 0o755);
  return rsyncPath;
}

function runClone({ supportsInfo }) {
  const tmp = makeTempDir();
  const repo = join(tmp, "repo");
  initRepo(repo);

  const binDir = join(tmp, "bin");
  mkdirSync(binDir, { recursive: true });
  writeFakeRsync(binDir);

  const logPath = join(tmp, "rsync.log");
  const gcRoot = join(tmp, "checkpoints");

  const env = {
    ...process.env,
    PATH: `${binDir}${delimiter}${process.env.PATH || ""}`,
    GC_ROOT: gcRoot,
    RSYNC_LOG: logPath,
    RSYNC_SUPPORTS_INFO: supportsInfo ? "1" : "0",
  };

  const res = spawnSync(process.execPath, [binPath, "clone", repo], {
    env,
    encoding: "utf8",
  });

  return { res, logPath, gcRoot, repo };
}

test("ch clone uses --info=progress2 when supported", () => {
  const { res, logPath, gcRoot, repo } = runClone({ supportsInfo: true });
  assert.equal(res.status, 0, res.stderr || "");
  const expected = realpathSync(join(gcRoot, basename(repo), `${basename(repo)}-1`));
  const actual = realpathSync(res.stdout.trim());
  assert.equal(actual, expected);

  const lines = readFileSync(logPath, "utf8").trim().split("\n");
  assert.ok(lines.some((line) => line.includes("--info=progress2 --version")));
  const last = lines[lines.length - 1];
  assert.ok(last.includes("--info=progress2"));
  assert.ok(!last.includes("--progress"));
});

test("ch clone falls back to --progress when --info is unsupported", () => {
  const { res, logPath, gcRoot, repo } = runClone({ supportsInfo: false });
  assert.equal(res.status, 0, res.stderr || "");
  const expected = realpathSync(join(gcRoot, basename(repo), `${basename(repo)}-1`));
  const actual = realpathSync(res.stdout.trim());
  assert.equal(actual, expected);

  const lines = readFileSync(logPath, "utf8").trim().split("\n");
  assert.ok(lines.some((line) => line.includes("--info=progress2 --version")));
  const last = lines[lines.length - 1];
  assert.ok(last.includes("--progress"));
  assert.ok(!last.includes("--info=progress2"));
});
