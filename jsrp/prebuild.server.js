const nodepath = require("node:path");
const nodefs = require("node:fs");
const { redText, blueText, greenText, yellowText } = require("./consoleColors");

/**
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

const relativeServerBuildDir = "../build-server";
const absoluteServerBuildDir = nodepath.resolve(__dirname, relativeServerBuildDir);

// If no existing server build was found, warn and exit (not a fatal error).
if (!nodefs.existsSync(absoluteServerBuildDir)) {
	console.log(blueText(`\n[INFO][prebuild.server.js] Unable to locate existing server build! Continuing...`, absoluteServerBuildDir));
	process.exit(0);
}

try {
	nodefs.renameSync(absoluteServerBuildDir, absoluteRootBuildDir);
} catch (e) {
	console.log(redText(`\n[ERROR][prebuild.server.js] Something went wrong renaming existing server build to "build"`, e.message));
	process.exit(1);
}

console.log(greenText(`\n[SUCCESS][prebuild.server.js] renamed "./build-server" to "./build"`, absoluteServerBuildDir, "to", absoluteRootBuildDir));
process.exit(0);
