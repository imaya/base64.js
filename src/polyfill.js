goog.provide('Polyfill');
goog.require('Base64');



(function(global) {
  if (global['atob'] === void 0) {
    global['atob'] = Base64.atob;
  }
  if (global['btoa'] === void 0) {
    global['btoa'] = Base64.btoa;
  }
})(/** @type {Window}*/this);
