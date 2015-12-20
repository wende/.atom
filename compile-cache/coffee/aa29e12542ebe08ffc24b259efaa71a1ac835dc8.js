(function() {
  var LayoutManager;

  LayoutManager = require('../lib/layout-manager');

  describe("LayoutManager", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('layoutManager');
    });
    return describe("when the layout-manager:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.layout-manager')).not.toExist();
        atom.workspaceView.trigger('layout-manager:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.layout-manager')).toExist();
          atom.workspaceView.trigger('layout-manager:toggle');
          return expect(atom.workspaceView.find('.layout-manager')).not.toExist();
        });
      });
    });
  });

}).call(this);
