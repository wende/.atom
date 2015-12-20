(function() {
  var TermView, capitalize, path;

  path = require('path');

  TermView = require('./lib/TermView');

  capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  module.exports = {
    termViews: [],
    focusedTerminal: false,
    config: {
      autoRunCommand: {
        type: 'string',
        "default": ''
      },
      titleTemplate: {
        type: 'string',
        "default": "Terminal ({{ bashName }})"
      },
      colors: {
        type: 'object',
        properties: {
          normalBlack: {
            type: 'color',
            "default": '#2e3436'
          },
          normalRed: {
            type: 'color',
            "default": '#cc0000'
          },
          normalGreen: {
            type: 'color',
            "default": '#4e9a06'
          },
          normalYellow: {
            type: 'color',
            "default": '#c4a000'
          },
          normalBlue: {
            type: 'color',
            "default": '#3465a4'
          },
          normalPurple: {
            type: 'color',
            "default": '#75507b'
          },
          normalCyan: {
            type: 'color',
            "default": '#06989a'
          },
          normalWhite: {
            type: 'color',
            "default": '#d3d7cf'
          },
          brightBlack: {
            type: 'color',
            "default": '#555753'
          },
          brightRed: {
            type: 'color',
            "default": '#ef2929'
          },
          brightGreen: {
            type: 'color',
            "default": '#8ae234'
          },
          brightYellow: {
            type: 'color',
            "default": '#fce94f'
          },
          brightBlue: {
            type: 'color',
            "default": '#729fcf'
          },
          brightPurple: {
            type: 'color',
            "default": '#ad7fa8'
          },
          brightCyan: {
            type: 'color',
            "default": '#34e2e2'
          },
          brightWhite: {
            type: 'color',
            "default": '#eeeeec'
          },
          background: {
            type: 'color',
            "default": '#000000'
          },
          foreground: {
            type: 'color',
            "default": '#f0f0f0'
          }
        }
      },
      scrollback: {
        type: 'integer',
        "default": 1000
      },
      cursorBlink: {
        type: 'boolean',
        "default": true
      },
      shellOverride: {
        type: 'string',
        "default": ''
      },
      shellArguments: {
        type: 'string',
        "default": (function(_arg) {
          var HOME, SHELL;
          SHELL = _arg.SHELL, HOME = _arg.HOME;
          switch (path.basename(SHELL.toLowerCase())) {
            case 'bash':
              return "--init-file " + (path.join(HOME, '.bash_profile'));
            case 'zsh':
              return "";
            default:
              return '';
          }
        })(process.env)
      },
      openPanesInSameSplit: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      this.state = state;
      ['up', 'right', 'down', 'left'].forEach((function(_this) {
        return function(direction) {
          return atom.commands.add("atom-workspace", "term2:open-split-" + direction, _this.splitTerm.bind(_this, direction));
        };
      })(this));
      atom.commands.add("atom-workspace", "term2:open", this.newTerm.bind(this));
      atom.commands.add("atom-workspace", "term2:pipe-path", this.pipeTerm.bind(this, 'path'));
      return atom.commands.add("atom-workspace", "term2:pipe-selection", this.pipeTerm.bind(this, 'selection'));
    },
    getColors: function() {
      var background, brightBlack, brightBlue, brightCyan, brightGreen, brightPurple, brightRed, brightWhite, brightYellow, foreground, normalBlack, normalBlue, normalCyan, normalGreen, normalPurple, normalRed, normalWhite, normalYellow, _ref;
      _ref = (atom.config.getAll('term2.colors'))[0].value, normalBlack = _ref.normalBlack, normalRed = _ref.normalRed, normalGreen = _ref.normalGreen, normalYellow = _ref.normalYellow, normalBlue = _ref.normalBlue, normalPurple = _ref.normalPurple, normalCyan = _ref.normalCyan, normalWhite = _ref.normalWhite, brightBlack = _ref.brightBlack, brightRed = _ref.brightRed, brightGreen = _ref.brightGreen, brightYellow = _ref.brightYellow, brightBlue = _ref.brightBlue, brightPurple = _ref.brightPurple, brightCyan = _ref.brightCyan, brightWhite = _ref.brightWhite, background = _ref.background, foreground = _ref.foreground;
      return [normalBlack, normalRed, normalGreen, normalYellow, normalBlue, normalPurple, normalCyan, normalWhite, brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightPurple, brightCyan, brightWhite, background, foreground];
    },
    createTermView: function() {
      var opts, termView, _base;
      opts = {
        runCommand: atom.config.get('term2.autoRunCommand'),
        shellOverride: atom.config.get('term2.shellOverride'),
        shellArguments: atom.config.get('term2.shellArguments'),
        titleTemplate: atom.config.get('term2.titleTemplate'),
        cursorBlink: atom.config.get('term2.cursorBlink'),
        colors: this.getColors()
      };
      termView = new TermView(opts);
      termView.on('remove', this.handleRemoveTerm.bind(this));
      if (typeof (_base = this.termViews).push === "function") {
        _base.push(termView);
      }
      return termView;
    },
    splitTerm: function(direction) {
      var activePane, item, openPanesInSameSplit, pane, splitter, termView;
      openPanesInSameSplit = atom.config.get('term2.openPanesInSameSplit');
      termView = this.createTermView();
      termView.on("click", (function(_this) {
        return function() {
          return _this.focusedTerminal = termView;
        };
      })(this));
      direction = capitalize(direction);
      splitter = (function(_this) {
        return function() {
          var pane;
          pane = activePane["split" + direction]({
            items: [termView]
          });
          activePane.termSplits[direction] = pane;
          return _this.focusedTerminal = [pane, pane.items[0]];
        };
      })(this);
      activePane = atom.workspace.getActivePane();
      activePane.termSplits || (activePane.termSplits = {});
      if (openPanesInSameSplit) {
        if (activePane.termSplits[direction] && activePane.termSplits[direction].items.length > 0) {
          pane = activePane.termSplits[direction];
          item = pane.addItem(termView);
          pane.activateItem(item);
          return this.focusedTerminal = [pane, item];
        } else {
          return splitter();
        }
      } else {
        return splitter();
      }
    },
    newTerm: function() {
      var item, pane, termView;
      termView = this.createTermView();
      pane = atom.workspace.getActivePane();
      item = pane.addItem(termView);
      return pane.activateItem(item);
    },
    pipeTerm: function(action) {
      var editor, item, pane, stream, _ref;
      editor = this.getActiveEditor();
      stream = (function() {
        switch (action) {
          case 'path':
            return editor.getBuffer().file.path;
          case 'selection':
            return editor.getSelectedText();
        }
      })();
      if (stream && this.focusedTerminal) {
        if (Array.isArray(this.focusedTerminal)) {
          _ref = this.focusedTerminal, pane = _ref[0], item = _ref[1];
          pane.activateItem(item);
        } else {
          item = this.focusedTerminal;
        }
        item.pty.write(stream.trim());
        return item.term.focus();
      }
    },
    handleRemoveTerm: function(termView) {
      return this.termViews.splice(this.termViews.indexOf(termView), 1);
    },
    deactivate: function() {
      return this.termViews.forEach(function(view) {
        return view.deactivate();
      });
    },
    serialize: function() {
      var termViewsState;
      termViewsState = this.termViews.map(function(view) {
        return view.serialize();
      });
      return {
        termViews: termViewsState
      };
    }
  };

}).call(this);
