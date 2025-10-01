// This runs before the main Emscripten module
var Module = Module || {};

Module.locateFile = function(path) {
  if (path.endsWith('.wasm')) {
    // Fetch the WASM from your CDN automatically
    return 'https://z3-tawny.vercel.app/z3-built.wasm';
  }
  return path;
};

// Wrap everything in a global IIFE
(function() {
  // Save the original factory exported by Emscripten
  var originalInit = window.initZ3;

  if (!originalInit) {
    console.warn('initZ3 not found — make sure z3-built.js is included first');
    return;
  }

  // Auto-initialize module
  window.Z3 = {
    ready: originalInit().then(function(z3Module) {
      // Optionally attach low-level and high-level APIs here
      // If you already have initWrapper and createApi in your fork
      if (window.initWrapper && window.createApi) {
        return window.initWrapper(() => z3Module).then(function(lowLevel) {
          var highLevel = window.createApi(lowLevel.Z3);
          var fullAPI = Object.assign({}, lowLevel, highLevel);
          window.Z3.module = fullAPI; // attach to global
          return fullAPI;
        });
      }
      // Otherwise just attach the raw module
      window.Z3.module = z3Module;
      return z3Module;
    }),
  };
})();
