(function() {
  var CompositeDisposable, Mocha, ResultView, context, currentContext, mocha, path, resultView;

  path = require('path');

  context = require('./context');

  Mocha = require('./mocha');

  ResultView = require('./result-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  mocha = null;

  resultView = null;

  currentContext = null;

  module.exports = {
    config: {
      nodeBinaryPath: {
        type: 'string',
        "default": '/usr/local/bin/node',
        description: 'Path to the node executable'
      },
      textOnlyOutput: {
        type: 'boolean',
        "default": false,
        description: 'Remove any colors from the Mocha output'
      },
      showContextInformation: {
        type: 'boolean',
        "default": false,
        description: 'Display extra information for troubleshooting'
      },
      options: {
        type: 'string',
        "default": '',
        description: 'Append given options always to Mocha binary'
      },
      optionsForDebug: {
        type: 'string',
        "default": '--debug --debug-brk',
        description: 'Append given options to Mocha binary to enable debugging'
      },
      env: {
        type: 'string',
        "default": '',
        description: 'Append environment variables'
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      resultView = new ResultView(state);
      this.subscriptions.add(atom.commands.add(resultView, 'result-view:close', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'core:cancel', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'core:close', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'mocha-test-runner:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'mocha-test-runner:debug': (function(_this) {
          return function() {
            return _this.run(true);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'mocha-test-runner:run-previous', (function(_this) {
        return function() {
          return _this.runPrevious();
        };
      })(this)));
      return this.subscriptions.add(atom.commands.add('atom-workspace', 'mocha-test-runner:debug-previous', (function(_this) {
        return function() {
          return _this.runPrevious(true);
        };
      })(this)));
    },
    deactivate: function() {
      this.close();
      this.subscriptions.dispose();
      return resultView = null;
    },
    serialize: function() {
      return resultView.serialize();
    },
    close: function() {
      var _ref;
      if (mocha) {
        mocha.stop();
      }
      resultView.detach();
      return (_ref = this.resultViewPanel) != null ? _ref.destroy() : void 0;
    },
    run: function(inDebugMode) {
      var editor;
      if (inDebugMode == null) {
        inDebugMode = false;
      }
      editor = atom.workspace.getActivePaneItem();
      currentContext = context.find(editor);
      return this.execute(inDebugMode);
    },
    runPrevious: function(inDebugMode) {
      if (inDebugMode == null) {
        inDebugMode = false;
      }
      if (currentContext) {
        return this.execute(inDebugMode);
      } else {
        return this.displayError('No previous test run');
      }
    },
    execute: function(inDebugMode) {
      var editor, nodeBinary;
      if (inDebugMode == null) {
        inDebugMode = false;
      }
      resultView.reset();
      if (!resultView.hasParent()) {
        this.resultViewPanel = atom.workspace.addBottomPanel({
          item: resultView
        });
      }
      if (atom.config.get('mocha-test-runner.showContextInformation')) {
        nodeBinary = atom.config.get('mocha-test-runner.nodeBinaryPath');
        resultView.addLine("Node binary:    " + nodeBinary + "\n");
        resultView.addLine("Root folder:    " + currentContext.root + "\n");
        resultView.addLine("Path to mocha:  " + currentContext.mocha + "\n");
        resultView.addLine("Debug-Mode:     " + inDebugMode + "\n");
        resultView.addLine("Test file:      " + currentContext.test + "\n");
        resultView.addLine("Selected test:  " + currentContext.grep + "\n\n");
      }
      editor = atom.workspace.getActivePaneItem();
      mocha = new Mocha(currentContext, inDebugMode);
      mocha.on('success', function() {
        return resultView.success();
      });
      mocha.on('failure', function() {
        return resultView.failure();
      });
      mocha.on('updateSummary', function(stats) {
        return resultView.updateSummary(stats);
      });
      mocha.on('output', function(text) {
        return resultView.addLine(text);
      });
      mocha.on('error', function(err) {
        resultView.addLine('Failed to run Mocha\n' + err.message);
        return resultView.failure();
      });
      return mocha.run();
    },
    displayError: function(message) {
      resultView.reset();
      resultView.addLine(message);
      resultView.failure();
      if (!resultView.hasParent()) {
        return atom.workspace.addBottomPanel({
          item: resultView
        });
      }
    }
  };

}).call(this);
