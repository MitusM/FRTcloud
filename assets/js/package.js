/* eslint-disable no-global-assign */
/* global define, _$ */
(function (window) {
  if (window.Package) {
    _$ = {}
  } else {
    window._$ = {}
  }

  // Check for jQuery
  // _$.jQueryLoaded = !!window.jQuery
})(window)

// AMD
if (typeof define === 'function' && define.amd) {
  define('_$', [], function () {
    return _$
  })
  // Common JS
} else if (typeof exports !== 'undefined' && !exports.nodeType) {
  if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
    exports = module.exports = _$
  }
  exports.default = _$
}