goog.provide('Base64.SafariOptimization');
goog.require('Base64');

goog.scope(function() {

/**
 * @param {string} str base64 encoded string.
 * @return {string} decoded byte-string.
 */
Base64.SafariOptimization.atob = function(str) {
  /** @type {string} */
  var dat = '';
  /** @type {number} */
  var length = str.length;
  /** @type {Array.<number>|Int16Array} */
  var table = Base64.SafariOptimization.atob.DecodeTable;
  /** @type {number} */
  var mod;
  /** @type {number} */
  var v0;
  /** @type {number} */
  var v1;
  /** @type {number} */
  var v2;
  /** @type {number} */
  var v3;
  /** @type {number} */
  var i;

  // remove padding
  while (str.charAt(length-1) === '=') {
    --length;
  }
  mod = length % 4;

  // check range
  if (mod === 1 || (str.length > 0 && length === 0)) {
    throw new Error("INVALID_CHARACTER_ERR");
  }

  // decode
  for (i = 0; i < length; i += 4) {
    v0 = str.charCodeAt(i);
    v1 = str.charCodeAt(i+1);
    v2 = str.charCodeAt(i+2);
    v3 = str.charCodeAt(i+3);

    // check character range
    if (
      v0 > 0xff || table[v0] === -1 ||
      v1 > 0xff || table[v1] === -1 ||
      v2 > 0xff || table[v2] === -1 ||
      v3 > 0xff || table[v3] === -1
    ) {
      throw new Error("INVALID_CHARACTER_ERR");
    }

    dat += String.fromCharCode(
      ((table[v0]       ) << 2) | (table[v1] >> 4),
      ((table[v1] & 0x0f) << 4) | (table[v2] >> 2),
      ((table[v2] & 0x03) << 6) |  table[v3]
    );
  }

  // remove padding
  if (mod > 0) {
    dat = dat.slice(0, dat.length - [0, 0, 2, 1][mod]);
  }

  return dat;
};

/**
 * @const
 * @type {(Array.<number>|Int16Array)}
 */
Base64.SafariOptimization.atob.DecodeTable = (
/**
 * @param {Int16Array|Array.<number>} table default decode table.
 * @return {Int16Array|Array.<number>} decode table for safari optimization.
 */
function(table) {
  /** @type {(Int16Array|Array.<number>)} */
  var optimized =
    (typeof Int16Array !== 'undefined' ? new Int16Array(table) : table.slice());

  optimized['='.charCodeAt(0)] = 0;

  return optimized;
})(Base64.atob.DecodeTable);

});
