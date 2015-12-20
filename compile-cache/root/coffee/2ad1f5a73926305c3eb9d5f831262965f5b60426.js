(function() {
  var Disposable;

  Disposable = require('atom').Disposable;

  module.exports = {
    instance: null,
    config: {
      lintOnFly: {
        title: 'Lint on fly',
        description: 'Lint files while typing, without the need to save them',
        type: 'boolean',
        "default": true
      },
      showErrorPanel: {
        title: 'Show Error Panel at the bottom',
        type: 'boolean',
        "default": true
      },
      showErrorTabLine: {
        title: 'Show line tab in error panel',
        type: 'boolean',
        "default": false
      },
      showErrorTabFile: {
        title: 'Show file tab in error panel',
        type: 'boolean',
        "default": true
      },
      showErrorTabProject: {
        title: 'Show project tab in error panel',
        type: 'boolean',
        "default": true
      },
      defaultErrorTab: {
        type: 'string',
        "default": 'File',
        "enum": ['Line', 'File', 'Project']
      },
      showErrorInline: {
        title: 'Show Inline Tooltips',
        descriptions: 'Show inline tooltips for errors',
        type: 'boolean',
        "default": true
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true
      },
      statusIconPosition: {
        title: 'Position of Status Icon on Bottom Bar',
        description: 'Requires a reload/restart to update',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left'
      }
    },
    activate: function() {
      var LinterPlus, atomPackage, implementation, legacy, linter, _i, _len, _ref, _ref1, _results;
      LinterPlus = require('./linter-plus.coffee');
      this.instance = new LinterPlus();
      legacy = require('./legacy.coffee');
      _ref = atom.packages.getLoadedPackages();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        atomPackage = _ref[_i];
        if (atomPackage.metadata['linter-package'] === true) {
          implementation = (_ref1 = atomPackage.metadata['linter-implementation']) != null ? _ref1 : atomPackage.name;
          linter = legacy(require("" + atomPackage.path + "/lib/" + implementation));
          _results.push(this.consumeLinter(linter));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    consumeLinter: function(linters) {
      var linter, _i, _len;
      if (!(linters instanceof Array)) {
        linters = [linters];
      }
      for (_i = 0, _len = linters.length; _i < _len; _i++) {
        linter = linters[_i];
        this.instance.addLinter(linter);
      }
      return new Disposable((function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = linters.length; _j < _len1; _j++) {
            linter = linters[_j];
            _results.push(_this.instance.deleteLinter(linter));
          }
          return _results;
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.instance.views.attachBottom(statusBar);
    },
    provideLinter: function() {
      return this.instance;
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUNBLE1BQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7T0FERjtBQUFBLE1BS0EsY0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sZ0NBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQU5GO0FBQUEsTUFTQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sOEJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQVZGO0FBQUEsTUFhQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sOEJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQWRGO0FBQUEsTUFpQkEsbUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlDQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FsQkY7QUFBQSxNQXFCQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFB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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/main.coffee