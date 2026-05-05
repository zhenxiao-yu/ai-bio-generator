/**
 * Windows + Node.js v24 build wrapper.
 *
 * Node.js v24 on Windows returns EISDIR from the native readlink() syscall on
 * regular files/dirs. Next.js's page-data collection phase calls realpath()
 * internally (libuv C level) which triggers this. No JS patch can intercept it.
 *
 * --preserve-symlinks tells Node to skip realpath() during module resolution,
 * preventing the readlink call entirely. Modules load by their given path
 * without symlink resolution — safe for standard npm installs.
 *
 * On Vercel (Linux) Node returns EINVAL for non-symlinks so no patch needed;
 * Vercel uses "next build --turbopack" directly (see vercel.json override).
 */
const path = require("path");
const { spawnSync } = require("child_process");

const existingOpts = (process.env.NODE_OPTIONS ?? "").replace(/--preserve-symlinks\S*/g, "").trim();
const nodeOptions = `${existingOpts} --preserve-symlinks --preserve-symlinks-main`.trim();

const result = spawnSync("npx", ["next", "build", "--turbopack"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_OPTIONS: nodeOptions },
  cwd: path.resolve(__dirname, ".."),
});

process.exit(result.status ?? 1);
