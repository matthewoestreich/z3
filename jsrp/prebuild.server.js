const nodepath = require("node:path");
const nodefs = require("node:fs");
const { redText, blueText, greenText, yellowText } = require("./consoleColors");

/**
 * Step 1. Check for existing "~/build" folder at root of project. If it exists, exit, so the user can 
 * decide what to do next.
 * 
 * After a build we rename the root build folder to "build-server" or "build-browser", depending on build type.
 * To make our builds faster, we rename "build-server" or "build-browser" back to "build" so our build system
 * can use the already existing cached build files.
 */

const relativeRootBuildDir = "../build";
const absoluteRootBuildDir = nodepath.resolve(__dirname, relativeRootBuildDir);
// If build folder exists at root of project, throw an error so you can manually decide what to do with it.
if (nodefs.existsSync(absoluteRootBuildDir)) {
	console.log(redText(`\n[ERROR][prebuild.server.js] "build" folder exists at root of project already. Please take care of it!`));
	process.exit(1);
}

/**
 * Step 2. Check for existing "~/build-server" folder (at root of project).
 * 
 * If it doesn't exist, let the user know we need to do a fresh build.
 */

const relativeServerBuildDir = "../build-server";
const absoluteServerBuildDir = nodepath.resolve(__dirname, relativeServerBuildDir);
// If no existing server build was found, warn and exit (not a fatal error).
if (!nodefs.existsSync(absoluteServerBuildDir)) {
	console.log(blueText(`\n[INFO][prebuild.server.js] Unable to locate existing server build! Starting a fresh build...`, absoluteServerBuildDir));
	process.exit(0);
}

/**
 * 
 * Step 3. Rename "~/build" folder (@ root of project) to "~/build-server"
 * 
 */

try {
	nodefs.renameSync(absoluteServerBuildDir, absoluteRootBuildDir);
} catch (e) {
	console.log(redText(`\n[ERROR][prebuild.server.js] Something went wrong renaming existing server build to "build"`, e.message));
	process.exit(1);
}

/**
 * 
 * Step 4. Success!
 * 
 */

console.log(greenText(`\n[SUCCESS][prebuild.server.js] renamed "./build-server" to "./build"`, absoluteServerBuildDir, "to", absoluteRootBuildDir));
process.exit(0);
