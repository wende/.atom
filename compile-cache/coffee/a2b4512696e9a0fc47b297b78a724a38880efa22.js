(function() {
  var GitControl;

  GitControl = require('../lib/git-control');

  describe("GitControl", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('git-control');
    });
    return describe("when the git-control:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.git-control')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'git-control:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var gitControlElement, gitControlPanel;
          expect(workspaceElement.querySelector('.git-control')).toExist();
          gitControlElement = workspaceElement.querySelector('.git-control');
          expect(gitControlElement).toExist();
          gitControlPanel = atom.workspace.panelForItem(gitControlElement);
          expect(gitControlPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'git-control:toggle');
          return expect(gitControlPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.git-control')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'git-control:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var gitControlElement;
          gitControlElement = workspaceElement.querySelector('.git-control');
          expect(gitControlElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'git-control:toggle');
          return expect(gitControlElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);
