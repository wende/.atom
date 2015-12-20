(function() {
  describe('Tool Bar package', function() {
    var toolBarAPI, toolBarService, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], toolBarService = _ref[1], toolBarAPI = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('tool-bar').then(function(pack) {
          return toolBarService = pack.mainModule.provideToolBar();
        });
      });
    });
    describe('@activate', function() {
      return it('appends only one tool bar', function() {
        expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1);
        atom.workspace.getActivePane().splitRight({
          copyActiveItem: true
        });
        return expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1);
      });
    });
    describe('@deactivate', function() {
      return it('removes the tool bar view', function() {
        atom.packages.deactivatePackage('tool-bar');
        return expect(workspaceElement.querySelector('.tool-bar')).toBeNull();
      });
    });
    describe('provides a service API', function() {
      it('for others to use', function() {
        expect(toolBarService).toBeDefined();
        return expect(typeof toolBarService).toBe('function');
      });
      describe('which can add a button', function() {
        var toolBar;
        toolBar = [][0];
        beforeEach(function() {
          toolBarAPI = toolBarService('specs-tool-bar');
          return toolBar = workspaceElement.querySelector('.tool-bar');
        });
        it('by third-party packages', function() {
          expect(toolBarAPI).toBeDefined();
          return expect(toolBarAPI.group).toBe('specs-tool-bar');
        });
        it('with minimum settings', function() {
          toolBarAPI.addButton({
            icon: 'octoface',
            callback: 'application:about',
            tooltip: 'About Atom'
          });
          expect(toolBar.children.length).toBe(1);
          expect(toolBar.firstChild.classList.contains('icon-octoface')).toBe(true);
          return expect(toolBar.firstChild.dataset.originalTitle).toBe('About Atom');
        });
        it('using custom icon set (Ionicons)', function() {
          toolBarAPI.addButton({
            icon: 'gear-a',
            callback: 'application:show-settings',
            tooltip: 'Show Settings',
            iconset: 'ion'
          });
          expect(toolBar.children.length).toBe(1);
          expect(toolBar.firstChild.classList.contains('ion')).toBe(true);
          expect(toolBar.firstChild.classList.contains('ion-gear-a')).toBe(true);
          return expect(toolBar.firstChild.dataset.originalTitle).toBe('Show Settings');
        });
        return it('and disabling it', function() {
          var button;
          button = toolBarAPI.addButton({
            icon: 'octoface',
            callback: 'application:about',
            tooltip: 'About Atom'
          });
          button.setEnabled(false);
          expect(toolBar.children.length).toBe(1);
          return expect(toolBar.firstChild.classList.contains('disabled')).toBe(true);
        });
      });
      return describe('which can add a spacer', function() {
        var toolBar;
        toolBar = [][0];
        beforeEach(function() {
          toolBarAPI = toolBarService('specs-tool-bar');
          return toolBar = workspaceElement.querySelector('.tool-bar');
        });
        return it('with no settings', function() {
          toolBarAPI.addSpacer();
          expect(toolBar.children.length).toBe(1);
          return expect(toolBar.firstChild.nodeName).toBe('HR');
        });
      });
    });
    describe('when tool-bar:toggle is triggered', function() {
      return it('hides or shows the tool bar', function() {
        atom.commands.dispatch(workspaceElement, 'tool-bar:toggle');
        expect(workspaceElement.querySelector('.tool-bar')).toBeNull();
        atom.commands.dispatch(workspaceElement, 'tool-bar:toggle');
        return expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1);
      });
    });
    return describe('when tool-bar position is changed', function() {
      var bottomPanelElement, leftPanelElement, rightPanelElement, topPanelElement, _ref1;
      _ref1 = [], topPanelElement = _ref1[0], rightPanelElement = _ref1[1], bottomPanelElement = _ref1[2], leftPanelElement = _ref1[3];
      beforeEach(function() {
        topPanelElement = atom.views.getView(atom.workspace.panelContainers.top);
        rightPanelElement = atom.views.getView(atom.workspace.panelContainers.right);
        bottomPanelElement = atom.views.getView(atom.workspace.panelContainers.bottom);
        return leftPanelElement = atom.views.getView(atom.workspace.panelContainers.left);
      });
      describe('by triggering tool-bar:position-top', function() {
        return it('the tool bar view is added to top pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-top');
          expect(topPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
          expect(rightPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull();
          return expect(leftPanelElement.querySelector('.tool-bar')).toBeNull();
        });
      });
      describe('by triggering tool-bar:position-right', function() {
        return it('the tool bar view is added to right pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-right');
          expect(topPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(rightPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
          expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull();
          return expect(leftPanelElement.querySelector('.tool-bar')).toBeNull();
        });
      });
      describe('by triggering tool-bar:position-bottom', function() {
        return it('the tool bar view is added to bottom pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-bottom');
          expect(topPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(rightPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(bottomPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
          return expect(leftPanelElement.querySelector('.tool-bar')).toBeNull();
        });
      });
      return describe('by triggering tool-bar:position-left', function() {
        return it('the tool bar view is added to left pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-left');
          expect(topPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(rightPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull();
          return expect(leftPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
        });
      });
    });
  });

}).call(this);
