(function(undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
  const detect = "Window" in this;

  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
  if (
    typeof WorkerGlobalScope === "undefined" &&
    typeof importScripts !== "function"
  ) {
    (function(global) {
      if (global.constructor) {
        global.Window = global.constructor;
      } else {
        (global.Window = global.constructor = new Function(
          "return function Window() {}"
        )()).prototype = this;
      }
    })(this);
  }
}.call(
  (typeof window === "object" && window) ||
    (typeof self === "object" && self) ||
    (typeof global === "object" && global) ||
    {}
));
