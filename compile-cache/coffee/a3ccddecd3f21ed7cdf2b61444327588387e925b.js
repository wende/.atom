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
    var describe, it;
    describe = extractMatch(line, /describe\s*\(?\s*['"](.*)['"]/);
    it = extractMatch(line, /it\s*\(?\s*['"](.*)['"]/);
    return describe || it || null;
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
