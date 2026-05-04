// Windows + Node.js v24 workaround: --preserve-symlinks prevents
// realpath() → readlink() calls that fail with EISDIR on regular files
const path = require("path");
const { spawnSync } = require("child_process");

const result = spawnSync("npx", ["next", "build", "--turbopack"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: "--preserve-symlinks --preserve-symlinks-main",
  },
  cwd: path.resolve(__dirname, ".."),
});

process.exit(result.status ?? 1);
