(function() {
  var BottomStatus, BottomTab, LinterViews, Message;

  BottomTab = require('./views/bottom-tab');

  BottomStatus = require('./views/bottom-status');

  Message = require('./views/message');

  LinterViews = (function() {
    function LinterViews(linter) {
      var visibleTabs, _ref;
      this.linter = linter;
      this.showPanel = true;
      this.showBubble = true;
      this.underlineIssues = true;
      this.messages = new Set;
      this.markers = [];
      this.statusTiles = [];
      this.tabs = new Map;
      this.tabs.set('line', new BottomTab());
      this.tabs.set('file', new BottomTab());
      this.tabs.set('project', new BottomTab());
      this.panel = document.createElement('div');
      this.bubble = null;
      this.bottomStatus = new BottomStatus();
      this.tabs.get('line').initialize('Line', (function(_this) {
        return function() {
          return _this.changeTab('line');
        };
      })(this));
      this.tabs.get('file').initialize('File', (function(_this) {
        return function() {
          return _this.changeTab('file');
        };
      })(this));
      this.tabs.get('project').initialize('Project', (function(_this) {
        return function() {
          return _this.changeTab('project');
        };
      })(this));
      this.bottomStatus.initialize();
      this.bottomStatus.addEventListener('click', function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter:next-error');
      });
      this.panelWorkspace = atom.workspace.addBottomPanel({
        item: this.panel,
        visible: false
      });
      visibleTabs = this.getVisibleTabKeys();
      this.scope = (_ref = atom.config.get('linter.defaultErrorTab', 'File')) != null ? _ref.toLowerCase() : void 0;
      if (visibleTabs.indexOf(this.scope) === -1) {
        this.scope = visibleTabs[0];
      }
      this.tabs.forEach((function(_this) {
        return function(tab, key) {
          tab.visible = false;
          return tab.active = _this.scope === key;
        };
      })(this));
      this.panel.id = 'linter-panel';
    }

    LinterViews.prototype.getMessages = function() {
      return this.messages;
    };

    LinterViews.prototype.setPanelVisibility = function(Status) {
      if (Status) {
        if (!this.panelWorkspace.isVisible()) {
          return this.panelWorkspace.show();
        }
      } else {
        if (this.panelWorkspace.isVisible()) {
          return this.panelWorkspace.hide();
        }
      }
    };

    LinterViews.prototype.setShowPanel = function(showPanel) {
      atom.config.set('linter.showErrorPanel', showPanel);
      this.showPanel = showPanel;
      if (showPanel) {
        return this.panel.removeAttribute('hidden');
      } else {
        return this.panel.setAttribute('hidden', true);
      }
    };

    LinterViews.prototype.setShowBubble = function(showBubble) {
      this.showBubble = showBubble;
    };

    LinterViews.prototype.setUnderlineIssues = function(underlineIssues) {
      this.underlineIssues = underlineIssues;
    };

    LinterViews.prototype.setBubbleOpaque = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.remove('transparent');
      }
      document.removeEventListener('keyup', this.setBubbleOpaque);
      return window.removeEventListener('blur', this.setBubbleOpaque);
    };

    LinterViews.prototype.setBubbleTransparent = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.add('transparent');
        document.addEventListener('keyup', this.setBubbleOpaque);
        return window.addEventListener('blur', this.setBubbleOpaque);
      }
    };

    LinterViews.prototype.render = function() {
      var counts, hasActiveEditor, visibleTabs;
      counts = {
        project: 0,
        file: 0
      };
      this.messages.clear();
      this.linter.eachEditorLinter((function(_this) {
        return function(editorLinter) {
          return _this.extractMessages(editorLinter.getMessages(), counts);
        };
      })(this));
      this.extractMessages(this.linter.getProjectMessages(), counts);
      this.updateLineMessages();
      this.renderPanel();
      this.tabs.get('file').count = counts.file;
      this.tabs.get('project').count = counts.project;
      this.bottomStatus.count = counts.project;
      hasActiveEditor = typeof atom.workspace.getActiveTextEditor() !== 'undefined';
      visibleTabs = this.getVisibleTabKeys();
      this.tabs.forEach(function(tab, key) {
        tab.visibility = hasActiveEditor && visibleTabs.indexOf(key) !== -1;
        tab.classList.remove('first-tab');
        return tab.classList.remove('last-tab');
      });
      if (visibleTabs.length > 0) {
        this.tabs.get(visibleTabs[0]).classList.add('first-tab');
        return this.tabs.get(visibleTabs[visibleTabs.length - 1]).classList.add('last-tab');
      }
    };

    LinterViews.prototype.updateBubble = function(point) {
      var activeEditor;
      this.removeBubble();
      if (!this.showBubble) {
        return;
      }
      if (!this.messages.size) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? activeEditor.getPath() : void 0)) {
        return;
      }
      point = point || activeEditor.getCursorBufferPosition();
      try {
        return this.messages.forEach((function(_this) {
          return function(message) {
            var _ref;
            if (!message.currentFile) {
              return;
            }
            if (!((_ref = message.range) != null ? _ref.containsPoint(point) : void 0)) {
              return;
            }
            _this.bubble = activeEditor.markBufferRange([point, point], {
              invalidate: 'never'
            });
            activeEditor.decorateMarker(_this.bubble, {
              type: 'overlay',
              position: 'tail',
              item: _this.renderBubble(message)
            });
            throw null;
          };
        })(this));
      } catch (_error) {}
    };

    LinterViews.prototype.updateCurrentLine = function(line) {
      if (this.currentLine !== line) {
        this.currentLine = line;
        this.updateLineMessages();
        return this.renderPanel();
      }
    };

    LinterViews.prototype.updateLineMessages = function() {
      var activeEditor;
      activeEditor = atom.workspace.getActiveTextEditor();
      return this.linter.eachEditorLinter((function(_this) {
        return function(editorLinter) {
          if (editorLinter.editor !== activeEditor) {
            return;
          }
          _this.lineMessages = [];
          _this.messages.forEach(function(message) {
            var _ref;
            if (message.currentFile && ((_ref = message.range) != null ? _ref.intersectsRow(_this.currentLine) : void 0)) {
              return _this.lineMessages.push(message);
            }
          });
          return _this.tabs.get('line').count = _this.lineMessages.length;
        };
      })(this));
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      var statusIconPosition;
      this.statusTiles.push(statusBar.addLeftTile({
        item: this.tabs.get('line'),
        priority: -1002
      }));
      this.statusTiles.push(statusBar.addLeftTile({
        item: this.tabs.get('file'),
        priority: -1001
      }));
      this.statusTiles.push(statusBar.addLeftTile({
        item: this.tabs.get('project'),
        priority: -1000
      }));
      statusIconPosition = atom.config.get('linter.statusIconPosition');
      return this.statusTiles.push(statusBar["add" + statusIconPosition + "Tile"]({
        item: this.bottomStatus,
        priority: 999
      }));
    };

    LinterViews.prototype.destroy = function() {
      var statusTile, _i, _len, _ref, _results;
      this.messages.clear();
      this.removeMarkers();
      this.panelWorkspace.destroy();
      this.removeBubble();
      _ref = this.statusTiles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        statusTile = _ref[_i];
        _results.push(statusTile.destroy());
      }
      return _results;
    };

    LinterViews.prototype.changeTab = function(Tab) {
      if (this.getActiveTabKey() === Tab) {
        this.showPanel = !this.showPanel;
        this.tabs.forEach(function(tab, key) {
          return tab.active = false;
        });
      } else {
        this.showPanel = true;
        this.scope = Tab;
        this.tabs.forEach(function(tab, key) {
          return tab.active = Tab === key;
        });
        this.renderPanel();
      }
      return this.setShowPanel(this.showPanel);
    };

    LinterViews.prototype.getActiveTabKey = function() {
      var activeKey;
      activeKey = null;
      this.tabs.forEach(function(tab, key) {
        if (tab.active) {
          return activeKey = key;
        }
      });
      return activeKey;
    };

    LinterViews.prototype.getActiveTab = function() {
      return this.tabs.entries().find(function(tab) {
        return tab.active;
      });
    };

    LinterViews.prototype.getVisibleTabKeys = function() {
      return [atom.config.get('linter.showErrorTabLine') ? 'line' : void 0, atom.config.get('linter.showErrorTabFile') ? 'file' : void 0, atom.config.get('linter.showErrorTabProject') ? 'project' : void 0].filter(function(key) {
        return key;
      });
    };

    LinterViews.prototype.removeBubble = function() {
      if (!this.bubble) {
        return;
      }
      this.bubble.destroy();
      return this.bubble = null;
    };

    LinterViews.prototype.renderBubble = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          return bubble.appendChild(Message.fromMessage(trace, {
            addPath: true
          }));
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderPanel = function() {
      var activeEditor;
      this.panel.innerHTML = '';
      this.removeMarkers();
      this.removeBubble();
      if (!this.messages.size) {
        return this.setPanelVisibility(false);
      }
      this.setPanelVisibility(true);
      activeEditor = atom.workspace.getActiveTextEditor();
      this.messages.forEach((function(_this) {
        return function(message) {
          var Element, marker;
          if (_this.scope === 'file') {
            if (!message.currentFile) {
              return;
            }
          }
          if (message.currentFile && message.range) {
            _this.markers.push(marker = activeEditor.markBufferRange(message.range, {
              invalidate: 'never'
            }));
            activeEditor.decorateMarker(marker, {
              type: 'line-number',
              "class": "linter-highlight " + message["class"]
            });
            if (_this.underlineIssues) {
              activeEditor.decorateMarker(marker, {
                type: 'highlight',
                "class": "linter-highlight " + message["class"]
              });
            }
          }
          if (_this.scope === 'line') {
            if (_this.lineMessages.indexOf(message) === -1) {
              return;
            }
          }
          Element = Message.fromMessage(message, {
            addPath: _this.scope === 'project',
            cloneNode: true
          });
          return _this.panel.appendChild(Element);
        };
      })(this));
      return this.updateBubble();
    };

    LinterViews.prototype.removeMarkers = function() {
      var marker, _i, _len, _ref;
      if (!this.markers.length) {
        return;
      }
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        try {
          marker.destroy();
        } catch (_error) {}
      }
      return this.markers = [];
    };

    LinterViews.prototype.extractMessages = function(Gen, counts) {
      var activeEditor, activeFile, isProject;
      isProject = this.scope === 'project';
      activeEditor = atom.workspace.getActiveTextEditor();
      activeFile = activeEditor != null ? activeEditor.getPath() : void 0;
      return Gen.forEach((function(_this) {
        return function(Entry) {
          return Entry.forEach(function(message) {
            if (activeEditor && ((!message.filePath && !isProject) || message.filePath === activeFile)) {
              counts.file++;
              counts.project++;
              message.currentFile = true;
            } else {
              counts.project++;
              message.currentFile = false;
            }
            return _this.messages.add(message);
          });
        };
      })(this));
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUixDQUFaLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsaUJBQVIsQ0FGVixDQUFBOztBQUFBLEVBSU07QUFDUyxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUNYLFVBQUEsaUJBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFEZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUZuQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsUUFBRCxHQUFZLEdBQUEsQ0FBQSxHQUpaLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFMWCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBTmYsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLElBQUQsR0FBUSxHQUFBLENBQUEsR0FSUixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxNQUFWLEVBQXNCLElBQUEsU0FBQSxDQUFBLENBQXRCLENBVEEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsTUFBVixFQUFzQixJQUFBLFNBQUEsQ0FBQSxDQUF0QixDQVZBLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLFNBQVYsRUFBeUIsSUFBQSxTQUFBLENBQUEsQ0FBekIsQ0FY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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/linter-views.coffee