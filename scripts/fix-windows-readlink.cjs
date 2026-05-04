// Patch for Windows + Node.js v24: fs.readlink returns EISDIR on regular files
// instead of EINVAL. Next.js's realpath code expects EINVAL to identify non-symlinks.
const fs = require("fs");
const originalReadlink = fs.readlink;

fs.readlink = function patchedReadlink(path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  originalReadlink.call(fs, path, options, function (err, linkString) {
    if (err && err.code === "EISDIR") {
      const fixedErr = Object.assign(new Error(err.message), {
        code: "EINVAL",
        errno: -22,
        syscall: "readlink",
        path: err.path,
      });
      callback(fixedErr, linkString);
    } else {
      callback(err, linkString);
    }
  });
};
