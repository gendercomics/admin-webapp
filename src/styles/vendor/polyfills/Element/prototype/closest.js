import "./matches";

(function(undefined) {
  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/detect.js
  const detect = "document" in this && "closest" in document.documentElement;

  if (detect) return;

  // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/polyfill.js
  Element.prototype.closest = function closest(selector) {
    let node = this;

    while (node) {
      if (node.matches(selector)) return node;
      node =
        "SVGElement" in window && node instanceof SVGElement
          ? node.parentNode
          : node.parentElement;
    }

    return null;
  };
}.call(
  (typeof window === "object" && window) ||
    (typeof self === "object" && self) ||
    (typeof global === "object" && global) ||
    {}
));
