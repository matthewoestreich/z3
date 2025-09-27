const fs = require("fs");
const path = require("path");

// Copy built js files to project root under "dist"

const jsRoot = path.resolve(__dirname, "./src/api/js");
const jsBuildRoot = path.resolve(jsRoot, "build");
const dist = path.resolve(__dirname, "./dist/build");

fs.cpSync(jsBuildRoot, dist, { recursive: true });