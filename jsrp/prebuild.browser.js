const nodepath = require("node:path");
const nodefs = require("node:fs");
const { redText, blueText, greenText, yellowText } = require("./consoleColors");

/**
 * Step 1. Check for existing "~/build" folder (at root of project)
 * 
 * After a build we rename the root build folder to "build-server" or "build-browser", depending on build type.
 * To make our builds faster, we rename "build-server" or "build-browser" back to "build" so our build system
 * can use the already existing cached build files.
 */

const relativeRootBuildDir = "../build";
const absoluteRootBuildDir = nodepath.resolve(__dirname, relativeRootBuildDir);
// If build folder exists at root of project, throw an error so you can manually decide what to do with it.
if (nodefs.existsSync(absoluteRootBuildDir)) {
  console.log(redText(`\n[ERROR][prebuild.browser.js] "build" folder exists at root of project already. Please take care of it!`));
  process.exit(1);
}

/**
 * Step 2. Check for exisitng "~./build-browser" folder
 * 
 * If it doesn't exist, just let the user know we need to start a fresh build.
 */

const relativeBrowserBuildDir = "../build-browser";
const absoluteBrowserBuildDir = nodepath.resolve(__dirname, relativeBrowserBuildDir);
// If no existing browser build was found, warn and exit (not a fatal error).
if (!nodefs.existsSync(absoluteBrowserBuildDir)) {
	console.log(blueText(`\n[INFO][prebuild.browser.js] Unable to locate existing browser build! Starting a fresh build...`, absoluteBrowserBuildDir));
	process.exit(0);
}

/**
 * 
 * Step 3. Rename "~/build" to "~/build-browser"
 * 
 */

try {
	nodefs.renameSync(absoluteBrowserBuildDir, absoluteRootBuildDir);
} catch (e) {
	console.log(redText(`\n[ERROR][prebuild.browser.js] Something went wrong renaming "browser-build" build to "build"`, e.message));
	process.exit(1);
}

/**
 * 
 * Step 4. Success!
 * 
 */

console.log(greenText(`\n[SUCCESS][prebuild.browser.js] renamed "./build-browser" to "./build"`, absoluteBrowserBuildDir, "to", absoluteRootBuildDir));
process.exit(0);
