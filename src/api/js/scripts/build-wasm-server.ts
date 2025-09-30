import { asyncFuncsServer } from "./async-fns";
import buildWasm from "./build-wasm";

const outFile = "build/server/z3-built.js";
buildWasm(asyncFuncsServer, outFile);
