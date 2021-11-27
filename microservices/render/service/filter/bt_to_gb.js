/**
 * filter for Nunjucks
 * Copyright (c) Thu Jan 25 2018 Mitus M.
 * Licensed under the Apache 2.0 license.
 */
const nunjucks = require("nunjucks");

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

module.exports = formatBytes;

module.exports.install = function (env, customName) {
  (env || nunjucks.configure()).addFilter(customName || "date", dateFormat);
};
