(function() {
  var closestPackage, fs, path, selectedTest, util;

  fs = require('fs');

  path = require('path');

  util = require('util');

  selectedTest = require('./selected-test');

  exports.find = function(editor) {
    var mochaBinary, root;
    root = closestPackage(editor.getPath());
    if (root) {
      mochaBinary = path.join(root, 'node_modules', '.bin', 'mocha');
      if (!fs.existsSync(mochaBinary)) {
        mochaBinary = 'mocha';
      }
      return {
        root: root,
        test: path.relative(root, editor.getPath()),
        grep: selectedTest.fromEditor(editor),
        mocha: mochaBinary
      };
    } else {
      return {
        root: path.dirname(editor.getPath()),
        test: path.basename(editor.getPath()),
        grep: selectedTest.fromEditor(editor),
        mocha: 'mocha'
      };
    }
  };

  closestPackage = function(folder) {
    var pkg;
    pkg = path.join(folder, 'package.json');
    if (fs.existsSync(pkg)) {
      return folder;
    } else if (folder === '/') {
      return null;
    } else {
      return closestPackage(path.dirname(folder));
    }
  };

}).call(this);
