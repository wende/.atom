(function() {
  var extractMatch, getTestName, localeval, path;

  path = require('path');

  localeval = require('localeval');

  exports.fromEditor = function(editor) {
    var line, row, test;
    row = editor.getCursorScreenPosition().row;
    line = editor.lineTextForBufferRow(row);
    test = getTestName(line);
    return test;
  };

  getTestName = function(line) {
    var describe, it, suite, test;
    describe = extractMatch(line, /describe\s*\(?\s*['"](.*)['"]/);
    suite = extractMatch(line, /suite\s*\(?\s*['"](.*)['"]/);
    it = extractMatch(line, /it\s*\(?\s*['"](.*)['"]/);
    test = extractMatch(line, /test\s*\(?\s*['"](.*)['"]/);
    return describe || suite || it || test || null;
  };

  extractMatch = function(line, regex) {
    var matches;
    matches = regex.exec(line);
    if (matches && matches.length >= 2) {
      return localeval("'" + matches[1] + "'");
    } else {
      return null;
    }
  };

}).call(this);
