// this wrapper works with async-fns to provide promise-based off-thread versions of some functions
// It's prepended directly by emscripten to the resulting z3-built.js

let threadTimeouts = [];

let capability = null;
function resolve_async(val) {
  // setTimeout is a workaround for https://github.com/emscripten-core/emscripten/issues/15900
  if (capability == null) {
    return;
  }
  let cap = capability;
  capability = null;

  setTimeout(() => {
    cap.resolve(val);
  }, 0);
}

function reject_async(val) {
  if (capability == null) {
    return;
  }
  let cap = capability;
  capability = null;

  setTimeout(() => {
    cap.reject(val);
  }, 0);
}

Module.async_call = function (f, ...args) {
  if (capability !== null) {
    throw new Error(`you can't execute multiple async functions at the same time; let the previous one finish first`);
  }
  let promise = new Promise((resolve, reject) => {
    capability = { resolve, reject };
  });
  f(...args);
  return promise;
};

let mainScriptUrlOrBlob;
try {
  const [jsResponse, wasmResponse] = await Promise.all([
    fetch('https://z3-tawny.vercel.app/z3-built.js'),
    fetch('https://z3-tawny.vercel.app/z3-built.wasm'),
  ]);

  if (!jsResponse.ok || !wasmResponse.ok) {
    console.error('js-randomness-predictor Failed to fetch z3 files', {
      jsResponse: jsResponse.ok,
      wasmResponse: wasmResponse.ok,
    });
  }

  const jsText = await jsResponse.text();
  const jsBlob = new Blob([jsText], { type: 'text/javascript' });
  mainScriptUrlOrBlob = URL.createObjectURL(jsBlob);

  console.log({ Module });

  Module.locateFile = (path, prefix) => {
    console.log({ step: 'locateFile', path, prefix });
    if (path.endsWith('.wasm')) {
      return 'https://z3-tawny.vercel.app/z3-built.wasm';
    }
    return prefix + path;
  };

  Module.mainScriptUrlOrBlob = mainScriptUrlOrBlob;
  
  Module.onRuntimeInitialized = () => {
    console.log('js-randomness-predictor initialized.');
  };

  const script = document.createElement('script');
  script.src = mainScriptUrlOrBlob;
  document.body.appendChild(script);

  /*
  function initialize() {
    try {
      if (typeof initZ3 === 'undefined') {
        setTimeout(() => initialize(), 1000);
      } else {
        initZ3(Module).then(initializedZ3Module => {
          console.log({ status: 'initialized', initializedZ3Module });
        });
      }
    } catch (e) {
      console.error('js-randomness-predictor something went wrong during initialize()', e);
    }
  }
  initialize();
  */
} catch (error) {
  console.error('js-randomness-predictor an error occurred during loading:', error);
}
