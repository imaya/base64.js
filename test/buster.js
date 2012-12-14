/**
 * unit test settings for BusterJS.
 */
var config = module.exports;

config["polyfill"] = {
  rootPath: "../",
  environment: "browser",
  tests: [
    "test/polyfill-test.js"
  ],
  libs: [
    "bin/base64_polyfill.min.js"
  ]
};

config["library"] = {
  rootPath: "../",
  environment: "browser",
  tests: [
    "test/library-test.js"
  ],
  libs: [
    "bin/base64.min.js"
  ]
};

