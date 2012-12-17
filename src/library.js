goog.provide('Library');
goog.require('Base64');
goog.require('Base64.SafariOptimization');
goog.require('Base64.FirefoxOptimization');

(function(global) {
  /** @type {string} */
  var vendor = navigator.vendor;
  /** @type {Object} */
  var target = global['Base64'] = global['Base64'] || {};

  if (target['atob'] === void 0) {
    target['atob'] =
      (vendor && vendor.indexOf('Apple') !== -1) ?
      Base64.SafariOptimization.atob :
      Base64.atob;
  }
  if (target['btoa'] === void 0) {
    target['btoa'] = Base64.btoa;
  }

  // array
  if (target['atobArray'] === void 0) {
    target['atobArray'] =
      (navigator.userAgent.indexOf('Firefox') !== -1) ?
        Base64.FirefoxOptimization.atobArray :
        Base64.atobArray;
  }
  if (target['btoaArray'] === void 0) {
    target['btoaArray'] = Base64.btoaArray;
  }

})(this);
