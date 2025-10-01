const fs = require("fs");
const path = require("path");
const { redText, blueText, greenText, yellowText } = require("./consoleColors");

/**
 * 
 * STEP 1. Copy built js files (from "src/api/js/build") to project root (to "/dist/build/browser") and to cdn (<at_project_root>/cdn)
 * 
 */

try {
  const src = path.resolve(__dirname, "../src/api/js/build/browser");
  const dest = path.resolve(__dirname, "../cdn");
  const distDest = path.resolve(__dirname, "../dist/browser");
  console.log(blueText(`\n[INFO][postbuild.browser.js] Copying built files\n\tFROM: ${src}\n\tTO: '${dest}'`));
  fs.cpSync(src, dest, { recursive: true });
  console.log(blueText(`\n[INFO][postbuild.browser.js] Copying built files\n\tFROM: ${src}\n\tTO: '${distDest}'`));
  fs.cpSync(src, distDest, { recursive: true });
} catch (e) {
  console.log(redText("\n[ERROR][postbuild.browser.js] Something went wrong copying built js file into 'dist/browser' or '/cdn'!", e.message));
}

/**
 * 
 * STEP 2. Copy vercel.json into CDN folder
 * 
 */

try {
  const vercelSrc = path.resolve(__dirname, "./vercel.json");
  const vercelDest = path.resolve(__dirname, "../cdn/vercel.json");
  console.log(blueText(`\n[INFO][postbuild.browser.js] Copying vercel.json into ./cdn`));
  fs.cpSync(vercelSrc, vercelDest);
  console.log(greenText(`\n[SUCCESS] Successfully copied vercel.json into ./cdn!`));
} catch (e) {
  console.log(redText(`\n[ERROR][postbuild.browser.js] Something went wrong copy vercel.json into ./cdn!`, e.message));
}

/**
 * 
 * STEP 3. Rename "./build" to "./build-browser"
 * 
 * To save "root" build (the actual z3lib.a build) we will rename the "/build" 
 * folder at the root of this project to "/build-browser". 
 * 
 * This way as a prebuild step we can just rename it back to  "build" so our 
 * builds don't take forever.
 * 
 */

try {
  const relativeDestDir = "../build-browser";
  const relativeRootBuildDirPath = "../build";
  const absoluteSrcPath = path.resolve(__dirname, relativeRootBuildDirPath);
  const absoluteDestPath = path.resolve(__dirname, relativeDestDir);
  console.log(blueText(`\n[INFO][postbuild.browser.js] Renaming "./build" folder (at root of project) to './build-browser'`));
  fs.renameSync(absoluteSrcPath, absoluteDestPath);
  console.log(greenText(`\n[SUCCESS][postbuild.browser.js] Successfully renamed "./build" to "./build-browser"!\n`));
} catch (e) {
  console.log(redText("\n[ERROR][postbuild.browser.js] Something went wrong renaming 'build' folder (at root of project)! src=", absoluteSrcPath, "dest=", absoluteDestPath, e.message));
  process.exit(1);
}