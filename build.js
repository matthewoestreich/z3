const fs = require("fs");
const path = require("path");

// Copy built js files to project root under "dist"

const src = path.resolve(__dirname, "./src/api/js/build");
const dest = path.resolve(__dirname, "./dist/build");

console.log();
console.log("#".repeat(100));
console.log(`Copying built files\nFROM: ${src}\nTO: '${dest}'`);
console.log("#".repeat(100));

fs.cpSync(src, dest, { recursive: true });