goog.provide('Base64');

/**
 * @define {boolean}
 */
var BASE64_BTOA_STRICT = true;

/**
 * @const
 */
var global = this;

goog.scope(function() {

/**
 * @const
 * @type {string}
 */
Base64.Character =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * @const
 * @type {string}
 */
Base64.RangeError = "INVALID_CHARACTER_ERR";

/**
 * @param {string} str byte-string.
 * @return {string} base64 encoded string.
 */
Base64.btoa = function(str) {
  /** @type {number} */
  var length = str.length;
  /** @type {number} */
  var outLength = (((length + 2) / 3) | 0) * 4;
  /** @type {string} */
  var out = '';
  /** @type {Array.<string>} */
  var table = Base64.btoa.CharacterTable;
  /** @type {number} */
  var pos = 0;
  /** @type {number} */
  var v0;
  /** @type {number} */
  var v1;
  /** @type {number} */
  var v2;

  // main encode
  if (length > 1) {
    while (pos < length - 2) {
      // read 3 characters
      v0 = str.charCodeAt(pos);
      v1 = str.charCodeAt(pos + 1);
      v2 = str.charCodeAt(pos + 2);
      pos += 3;

      // check
      if (BASE64_BTOA_STRICT && (v0 > 0xff || v1 > 0xff || v2 > 0xff)) {
        throw new Error(Base64.RangeError);
      }

      // output 4 character
      out +=
        table[ (v0 >> 2) & 0x3f] +
        table[((v1 >> 4) & 0x0f) | ((v0 << 4) & 0x3f)] +
        table[((v2 >> 6) & 0x03) | ((v1 << 2) & 0x3f)] +
        table[  v2       & 0x3f];
    }
  }

  // sub encode
  if (pos < length) {
    v0 = str.charCodeAt(pos++);
    if (BASE64_BTOA_STRICT && v0 > 0xff) {
      throw new Error(Base64.RangeError);
    }
    out += table[(v0 >> 2) & 0x3f];
    if (pos < length) {
      v1 = str.charCodeAt(pos);
      if (BASE64_BTOA_STRICT && v1 > 0xff) {
        throw new Error(Base64.RangeError);
      }
      out +=
        table[((v1 >> 4) & 0x0f) | ((v0 << 4) & 0x3f)] +
        table[ (v1 << 2) & 0x3f];
    } else {
      out += table[ (v0 << 4) & 0x3f];
    }
  }

  // Add padding
  v0 = outLength - out.length;
  if (v0 > 0) {
    out += v0 === 2 ? "==" : "=";
  }

  return out;
};

/**
 * @const
 * @type {Array.<string>}
 */
Base64.btoa.CharacterTable = Base64.Character.split('');

/**
 * @param {string} str base64 encoded string.
 * @return {string} decoded byte-string.
 */
Base64.atob = function(str) {
  /** @type {number} */
  var buffer = 0;
  /** @type {number} */
  var pos = 0;
  /** @type {number} */
  var length = str.length;
  var out= '';
  /** @type {number} */
  var bitlen = 0;
  /** @type {Array.<string>} */
  var chars = Base64.atob.StringFromCharCode;
  /** @type {Array.<number>|Int16Array} */
  var decode = Base64.atob.DecodeTable;
  /** @type {number} */
  var decoded;
  /** @type {number} */
  var tmp;

  // remove padding
  while (str.charAt(length-1) === '=') {
    --length;
  }

  // check range
  if (length % 4 === 1 || (str.length > 0 && length === 0)) {
    throw new Error(Base64.RangeError);
  }

  while (pos < length) {
    tmp = str.charCodeAt(pos++);
    decoded = tmp < 256 ? decode[tmp] : -1;

    // check character range
    if (decoded === -1) {
      throw new Error(Base64.RangeError);
    }

    // add buffer (6bit)
    buffer = (buffer << 6) + decoded;
    bitlen += 6;

    // decode byte
    if (bitlen >= 8) {
      bitlen -= 8;

      // extract byte
      tmp = buffer >> bitlen;

      // decode character
      out += chars[tmp];

      // remove character bits
      buffer ^= tmp << bitlen;
    }
  }

  return out;
};

/**
 * @const
 * @type {Array.<string>}
 */
Base64.atob.StringFromCharCode = (
/**
 * @return {Array.<string>}
 */
function() {
  /** @type {Array.<string>} */
  var table = new Array(256);
  /** @type {number} */
  var i;

  for (i = 0; i < 0xff; ++i) {
    table[i] = String.fromCharCode(i);
  }

  return table;
})();

/**
 * @const
 * @type {(Array.<number>|Int16Array)}
 */
Base64.atob.DecodeTable = (
/**
 * @param {Array.<string>} chars character table.
 * @return {Int16Array|Array.<number>} decode table.
 */
function(chars) {
  /** @type {(Int16Array|Array.<number>)} */
  var table = new (typeof Int16Array !== 'undefined' ? Int16Array : Array)(256);
  /** @type {Array.<string>} */
  var stringFromCharCode = Base64.atob.StringFromCharCode;
  /** @type {number} */
  var i;

  for (i = 0; i < 0xff; ++i) {
    table[i] = chars.indexOf(stringFromCharCode[i]);
  }

  return table;
})(Base64.btoa.CharacterTable);

//-----------------------------------------------------------------------------

/**
 * @param {(Array.<number>|Uint8Array)} array byte-array.
 * @return {string} base64 encoded string.
 */
Base64.btoaArray = function(array) {
  /** @type {number} */
  var length = array.length;
  /** @type {number} */
  var outLength = (((length + 2) / 3) | 0) * 4;
  /** @type {string} */
  var out = '';
  /** @type {(Uint8Array|Array.<number>)} */
  var table = Base64.btoa.CharacterTable;
  /** @type {number} */
  var pos = 0;
  /** @type {number} */
  var v0;
  /** @type {number} */
  var v1;
  /** @type {number} */
  var v2;

  // main encode
  if (length > 1) {
    while (pos < length - 2) {
      // read 3 characters
      v0 = array[pos];
      v1 = array[pos + 1];
      v2 = array[pos + 2];
      pos += 3;

      // check
      if (BASE64_BTOA_STRICT && (v0 > 0xff || v1 > 0xff || v2 > 0xff)) {
        throw new Error(Base64.RangeError);
      }

      // output 4 character
      out +=
        table[ (v0 >> 2) & 0x3f] +
        table[((v1 >> 4) & 0x0f) | ((v0 << 4) & 0x3f)] +
        table[((v2 >> 6) & 0x03) | ((v1 << 2) & 0x3f)] +
        table[  v2       & 0x3f];
    }
  }

  // sub encode
  if (pos < length) {
    v0 = array[pos++];
    if (BASE64_BTOA_STRICT && v0 > 0xff) {
      throw new Error(Base64.RangeError);
    }
    out += table[(v0 >> 2) & 0x3f];
    if (pos < length) {
      v1 = array[pos];
      if (BASE64_BTOA_STRICT && v1 > 0xff) {
        throw new Error(Base64.RangeError);
      }
      out +=
        table[((v1 >> 4) & 0x0f) | ((v0 << 4) & 0x3f)] +
        table[ (v1 << 2) & 0x3f];
    } else {
      out += table[ (v0 << 4) & 0x3f];
    }
  }

  // Add padding
  v0 = outLength - out.length;
  if (v0 > 0) {
    out += v0 === 2 ? "==" : "=";
  }

  return out;
};

/**
 * @const
 * @type {(Uint8Array|Array.<number>)}
 */
Base64.btoaArray.CharacterTable = (
/**
 * @param {string} chars
 * @return {(Uint8Array|Array.<number>)}
 */
function(chars) {
  /** @type {(Uint8Array|Array.<number>)} */
  var array =
    new (typeof Uint8Array !== 'undefined' ? Uint8Array : Array)(chars.length);
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  for (i = 0, il = array.length; i < il; ++i) {
    array[i] = chars.charCodeAt(i);
  }

  return array;
})(Base64.Character);

/**
 * @param {string} str base64 encoded string.
 * @return {Array.<number>|Uint8Array} decoded byte-array.
 */
Base64.atobArray = function(str) {
  /** @type {number} */
  var buffer = 0;
  /** @type {number} */
  var pos = 0;
  /** @type {number} */
  var length = str.length;
  /** @type {(Uint8Array|Array.<number>)} */
  var out;
  /** @type {number} */
  var outpos = 0;
  /** @type {number} */
  var bitlen = 0;
  /** @type {Array.<number>|Int16Array} */
  var decode = Base64.atobArray.DecodeTable;
  /** @type {number} */
  var decoded;
  /** @type {number} */
  var tmp;
  /** @type {number} */
  var mod;

  // remove padding
  while (str.charAt(length-1) === '=') {
    --length;
  }
  mod = length % 4;

  // create output buffer
  out = new (typeof Uint8Array !== 'undefined' ? Uint8Array : Array)(
    ((length + 3) / 4 | 0) * 3 - [0, 0, 2, 1][mod]
  );

  // check range
  if (length % 4 === 1 || (str.length > 0 && length === 0)) {
    throw new Error(Base64.RangeError);
  }

  while (pos < length) {
    tmp = str.charCodeAt(pos++);
    decoded = tmp < 256 ? decode[tmp] : -1;

    // check character range
    if (decoded === -1) {
      throw new Error(Base64.RangeError);
    }

    // add buffer (6bit)
    buffer = (buffer << 6) + decoded;
    bitlen += 6;

    // decode byte
    if (bitlen >= 8) {
      bitlen -= 8;

      // extract byte
      tmp = buffer >> bitlen;

      // decode character
      out[outpos++] = tmp;

      // remove character bits
      buffer ^= tmp << bitlen;
    }
  }

  return out;
};

/**
 * @const
 * @type {(Array.<number>|Int16Array)}
 */
Base64.atobArray.DecodeTable = (
/**
 * @param {Uint8Array|Array.<number>} encodeTable character table.
 * @return {Int16Array|Array.<number>} decode table.
 */
function(encodeTable) {
  /** @type {(Int16Array|Array.<number>)} */
  var table = new (typeof Int16Array !== 'undefined' ? Int16Array : Array)(256);
  /** @type {number} */
  var i;
  /** @type {Array.<number>} */
  var array = encodeTable instanceof Array ?
    encodeTable : Array.prototype.slice.call(encodeTable);

  for (i = 0; i < 0xff; ++i) {
    table[i] = array.indexOf(i);
  }

  return table;
})(Base64.btoaArray.CharacterTable);

});
