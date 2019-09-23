(function(undefined) {
  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/detect.js
  const detect = "document" in this && "matches" in document.documentElement;

  if (detect) return;

  // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/polyfill.js
  Element.prototype.matches =
    Element.prototype.webkitMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.mozMatchesSelector ||
    function matches(selector) {
      const element = this;
      const elements = (
        element.document || element.ownerDocument
      ).querySelectorAll(selector);
      let index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return !!elements[index];
    };
}.call(
  (typeof window === "object" && window) ||
    (typeof self === "object" && self) ||
    (typeof global === "object" && global) ||
    {}
));
