const nodepath = require("path");

async function inspectWasm(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const module = await WebAssembly.compile(buffer);

  console.log("Exports:", WebAssembly.Module.exports(module));
  console.log("Imports:", WebAssembly.Module.imports(module));
}

//inspectWasm(nodepath.resolve(__dirname, "../cdn/z3-built.wasm"));
inspectWasm("https://z3-tawny.vercel.app/z3-built.wasm");