const fs = require("fs");
const path = require("path");
const { redText, blueText, greenText, yellowText } = require("./consoleColors");

// Copy built js files (from "src/api/js/build") to project root (to "/dist/build/browser")

const src = path.resolve(__dirname, "../src/api/js/build/browser");
const dest = path.resolve(__dirname, "../cdn");

console.log(blueText(`\n[INFO][postbuild.browser.js] Copying built files\n\tFROM: ${src}\n\tTO: '${dest}'`))

try {
  fs.cpSync(src, dest, { recursive: true });
} catch (e) {
  console.log(redText("\n[ERROR][postbuild.browser.js] Something went wrong copying built js file into dest! src=", src, "dest=", dest, e.message));
}

// To save "root" build (the actual z3lib.a build) we will rename the "/build" folder at the root
// of this project to "/build-browser". This way as a prebuild step we can just rename it back to 
// "build" so our builds don't take forever.
console.log(blueText(`\n[INFO][postbuild.browser.js] Renaming "./build" folder (at root of project) to './build-browser'`));

const relativeDestDir = "../build-browser";
const relativeRootBuildDirPath = "../build";
const absoluteSrcPath = path.resolve(__dirname, relativeRootBuildDirPath);
const absoluteDestPath = path.resolve(__dirname, relativeDestDir);

try {
  fs.renameSync(absoluteSrcPath, absoluteDestPath);
} catch (e) {
  console.log(redText("\n[ERROR][postbuild.browser.js] Something went wrong renaming 'build' folder (at root of project)! src=", absoluteSrcPath, "dest=", absoluteDestPath, e.message));
  process.exit(1);
}

console.log(greenText(`\n[SUCCESS][postbuild.browser.js] Successfully renamed "./build" to "./build-browser"!\n`));