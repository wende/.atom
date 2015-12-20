(function() {
  var CompositeDisposable, LinterInitializer;

  CompositeDisposable = require('atom').CompositeDisposable;

  LinterInitializer = (function() {
    function LinterInitializer() {}

    LinterInitializer.prototype.config = {
      lintOnSave: {
        type: 'boolean',
        "default": true
      },
      lintOnChange: {
        type: 'boolean',
        "default": true
      },
      lintOnChangeMethod: {
        type: 'string',
        "default": 'debounce',
        "enum": ['throttle', 'debounce'],
        description: 'Change method between two lint on change'
      },
      clearOnChange: {
        type: 'boolean',
        "default": false
      },
      lintOnEditorFocus: {
        type: 'boolean',
        "default": true
      },
      showHighlighting: {
        type: 'boolean',
        "default": true
      },
      showGutters: {
        type: 'boolean',
        "default": true
      },
      lintOnChangeInterval: {
        type: 'integer',
        "default": 1000
      },
      lintDebug: {
        type: 'boolean',
        "default": false
      },
      showErrorInline: {
        type: 'boolean',
        "default": true
      },
      showInfoMessages: {
        type: 'boolean',
        "default": false,
        description: "Display linter messages with error level “Info”."
      },
      statusBar: {
        type: 'string',
        "default": 'None',
        "enum": ['None', 'Show all errors', 'Show error of the selected line', 'Show error if the cursor is in range']
      },
      executionTimeout: {
        type: 'integer',
        "default": 5000,
        description: 'Linter executables are killed after this timeout. Set to 0 to disable.'
      },
      ignoredLinterErrors: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      subtleLinterErrors: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      }
    };

    LinterInitializer.prototype.setDefaultOldConfig = function() {
      if (atom.config.get('linter.showErrorInStatusBar') === false) {
        atom.config.set('linter.statusBar', 'None');
      } else if (atom.config.get('linter.showAllErrorsInStatusBar')) {
        atom.config.set('linter.statusBar', 'Show all errors');
      } else if (atom.config.get('linter.showStatusBarWhenCursorIsInErrorRange')) {
        atom.config.set('linter.statusBar', 'Show error if the cursor is in range');
      }
      atom.config.unset('linter.showAllErrorsInStatusBar');
      atom.config.unset('linter.showErrorInStatusBar');
      return atom.config.unset('linter.showStatusBarWhenCursorIsInErrorRange');
    };

    LinterInitializer.prototype.activate = function() {
      var InlineView, LinterView, StatusBarSummaryView, StatusBarView, atomPackage, implemention, linterClasses, _i, _len, _ref, _ref1;
      this.setDefaultOldConfig();
      this.linterViews = new Set();
      this.subscriptions = new CompositeDisposable;
      linterClasses = [];
      _ref = atom.packages.getLoadedPackages();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        atomPackage = _ref[_i];
        if (atomPackage.metadata['linter-package'] === true) {
          implemention = (_ref1 = atomPackage.metadata['linter-implementation']) != null ? _ref1 : atomPackage.name;
          linterClasses.push(require("" + atomPackage.path + "/lib/" + implemention));
        }
      }
      this.enabled = true;
      StatusBarView = require('./statusbar-view');
      this.statusBarView = new StatusBarView();
      StatusBarSummaryView = require('./statusbar-summary-view');
      this.statusBarSummaryView = new StatusBarSummaryView();
      InlineView = require('./inline-view');
      this.inlineView = new InlineView();
      LinterView = require('./linter-view');
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var linterView;
          if (editor.linterView != null) {
            return;
          }
          linterView = new LinterView(editor, _this.statusBarView, _this.statusBarSummaryView, _this.inlineView, linterClasses);
          _this.linterViews.add(linterView);
          return _this.subscriptions.add(linterView.onDidDestroy(function() {
            return _this.linterViews["delete"](linterView);
          }));
        };
      })(this)));
    };

    LinterInitializer.prototype.deactivate = function() {
      this.subscriptions.dispose();
      
    for (var linterView of this.linterViews) {
      linterView.remove();
    }
    ;
      this.linterViews = null;
      this.inlineView.remove();
      this.inlineView = null;
      this.statusBarView.remove();
      this.statusBarView = null;
      this.statusBarSummaryView.remove();
      return this.statusBarSummaryView = null;
    };

    return LinterInitializer;

  })();

  module.exports = new LinterInitializer();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFJTTttQ0FHSjs7QUFBQSxnQ0FBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUdBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLGtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsVUFEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FGTjtBQUFBLFFBR0EsV0FBQSxFQUFhLDBDQUhiO09BUEY7QUFBQSxNQVdBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BWkY7QUFBQSxNQWNBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQWZGO0FBQUEsTUFpQkEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BbEJGO0FBQUEsTUFvQkEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FyQkY7QUFBQSxNQXVCQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0F4QkY7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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/init.coffee