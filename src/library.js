goog.provide('Library');
goog.require('Base64');
goog.require('Base64.SafariOptimization');

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
})(this);
