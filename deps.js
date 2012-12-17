goog.addDependency('./base64.js', ['Base64'], []);
goog.addDependency('./polyfill.js', ['Polyfill'], ['Base64', 'Base64.SafariOptimization']);
goog.addDependency('./safari.js', ['Base64.SafariOptimization'], ['Base64']);
goog.addDependency('./firefox.js', ['Base64.FirefoxOptimization'], ['Base64']);
