import "./Document";

(function(undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
  const detect = "Element" in this && "HTMLElement" in this;

  if (detect) return;

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
  (function() {
    // IE8
    if (window.Element && !window.HTMLElement) {
      window.HTMLElement = window.Element;
      return;
    }

    // create Element constructor
    window.Element = window.HTMLElement = new Function(
      "return function Element() {}"
    )();

    // generate sandboxed iframe
    const vbody = document.appendChild(document.createElement("body"));
    const frame = vbody.appendChild(document.createElement("iframe"));

    // use sandboxed iframe to replicate Element functionality
    const frameDocument = frame.contentWindow.document;
    const prototype = (Element.prototype = frameDocument.appendChild(
      frameDocument.createElement("*")
    ));
    const cache = {};

    // polyfill Element.prototype on an element
    var shiv = function(element, deep) {
      const childNodes = element.childNodes || [];
      let index = -1;
      let key;
      let value;
      let childNode;

      if (element.nodeType === 1 && element.constructor !== Element) {
        element.constructor = Element;

        for (key in cache) {
          value = cache[key];
          element[key] = value;
        }
      }

      while ((childNode = deep && childNodes[++index])) {
        shiv(childNode, deep);
      }

      return element;
    };

    const elements = document.getElementsByTagName("*");
    const nativeCreateElement = document.createElement;
    let interval;
    let loopLimit = 100;

    prototype.attachEvent("onpropertychange", event => {
      const { propertyName } = event;
      const nonValue = !cache.hasOwnProperty(propertyName);
      const newValue = prototype[propertyName];
      const oldValue = cache[propertyName];
      let index = -1;
      let element;

      while ((element = elements[++index])) {
        if (element.nodeType === 1) {
          if (nonValue || element[propertyName] === oldValue) {
            element[propertyName] = newValue;
          }
        }
      }

      cache[propertyName] = newValue;
    });

    prototype.constructor = Element;

    if (!prototype.hasAttribute) {
      // <Element>.hasAttribute
      prototype.hasAttribute = function hasAttribute(name) {
        return this.getAttribute(name) !== null;
      };
    }

    // Apply Element prototype to the pre-existing DOM as soon as the body element appears.
    function bodyCheck() {
      if (!loopLimit--) clearTimeout(interval);
      if (
        document.body &&
        !document.body.prototype &&
        /(complete|interactive)/.test(document.readyState)
      ) {
        shiv(document, true);
        if (interval && document.body.prototype) clearTimeout(interval);
        return !!document.body.prototype;
      }
      return false;
    }
    if (!bodyCheck()) {
      document.onreadystatechange = bodyCheck;
      interval = setInterval(bodyCheck, 25);
    }

    // Apply to any new elements created after load
    document.createElement = function createElement(nodeName) {
      const element = nativeCreateElement(String(nodeName).toLowerCase());
      return shiv(element);
    };

    // remove sandboxed iframe
    document.removeChild(vbody);
  })();
}.call(
  (typeof window === "object" && window) ||
    (typeof self === "object" && self) ||
    (typeof global === "object" && global) ||
    {}
));
