(async () => {
  let mainScriptUrlOrBlob;
  try {
    const [jsResponse, wasmResponse] = await Promise.all([
      fetch("https://z3-tawny.vercel.app/z3-built.js"),
      fetch("https://z3-tawny.vercel.app/z3-built.wasm"),
    ]);

    if (!jsResponse.ok || !wasmResponse.ok) {
     console.error("js-randomness-predictor Failed to fetch z3 files", { jsResponse: jsResponse.ok, wasmResponse: wasmResponse.ok });
    }

    const jsText = await jsResponse.text();
    const jsBlob = new Blob([jsText], { type: "text/javascript" });
    mainScriptUrlOrBlob = URL.createObjectURL(jsBlob);

    var Module = {
      locateFile: (path, prefix) => {
        console.log({ step: "locateFile", path, prefix });
        if (path.endsWith(".wasm")) {
          return "https://z3-tawny.vercel.app/z3-built.wasm";
        }
        return prefix + path;
      },
      mainScriptUrlOrBlob: mainScriptUrlOrBlob,
      onRuntimeInitialized: () => {
        console.log("js-randomness-predictor initialized.");
      },
    };

    const script = document.createElement("script");
    script.src = mainScriptUrlOrBlob;
    document.body.appendChild(script);

    function initialize() {
      try {
        if (typeof initZ3 === "undefined") {
          setTimeout(() => initialize(), 1000);
        } else {
          initZ3(Module).then(() => {
            window.initZ3 = initZ3;
          });
        }
      } catch (e) {
        console.error("js-randomness-predictor something went wrong during initialize()", e);
      }
    }

    initialize();
  } catch (error) {
    console.error("js-randomness-predictor an error occurred during loading:", error);
  }
})();
