(function() {
  var LayoutManagerView, WorkspaceView;

  LayoutManagerView = require('../lib/layout-manager-view');

  WorkspaceView = require('atom').WorkspaceView;

  describe("LayoutManagerView", function() {
    return it("has one valid test", function() {
      return expect("life").toBe("easy");
    });
  });

}).call(this);
