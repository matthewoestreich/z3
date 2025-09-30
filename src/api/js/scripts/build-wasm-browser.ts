import { asyncFuncsBrowser } from "./async-fns";
import buildWasm from "./build-wasm";

const outFile = "build/browser/z3-built.js";
buildWasm(asyncFuncsBrowser, outFile);