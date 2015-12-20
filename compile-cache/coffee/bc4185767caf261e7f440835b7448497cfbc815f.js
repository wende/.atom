(function() {
  var $, Task, TermView, Terminal, View, debounce, fs, keypather, last, os, path, renderTemplate, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  util = require('util');

  path = require('path');

  os = require('os');

  fs = require('fs-plus');

  debounce = require('debounce');

  Terminal = require('atom-term.js');

  keypather = require('keypather')();

  Task = require('atom').Task;

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  last = function(str) {
    return str[str.length - 1];
  };

  renderTemplate = function(template, data) {
    var vars;
    vars = Object.keys(data);
    return vars.reduce(function(_template, key) {
      return _template.split(RegExp("\\{\\{\\s*" + key + "\\s*\\}\\}")).join(data[key]);
    }, template.toString());
  };

  TermView = (function(_super) {
    __extends(TermView, _super);

    TermView.content = function() {
      return this.div({
        "class": 'term2'
      });
    };

    function TermView(opts) {
      var editorPath;
      this.opts = opts != null ? opts : {};
      if (opts.shellOverride) {
        opts.shell = opts.shellOverride;
      } else {
        opts.shell = process.env.SHELL || 'bash';
      }
      opts.shellArguments || (opts.shellArguments = '');
      editorPath = keypather.get(atom, 'workspace.getEditorViews[0].getEditor().getPath()');
      opts.cwd = opts.cwd || atom.project.getPaths()[0] || editorPath || process.env.HOME;
      TermView.__super__.constructor.apply(this, arguments);
    }

    TermView.prototype.forkPtyProcess = function(sh, args) {
      var processPath, _ref1;
      if (args == null) {
        args = [];
      }
      processPath = require.resolve('./pty');
      path = (_ref1 = atom.project.getPaths()[0]) != null ? _ref1 : '~';
      return Task.once(processPath, fs.absolute(path), sh, args);
    };

    TermView.prototype.initialize = function(state) {
      var args, colors, colorsArray, cols, cursorBlink, cwd, rows, runCommand, scrollback, shell, shellArguments, shellOverride, term, _ref1, _ref2;
      this.state = state;
      _ref1 = this.getDimensions(), cols = _ref1.cols, rows = _ref1.rows;
      _ref2 = this.opts, cwd = _ref2.cwd, shell = _ref2.shell, shellArguments = _ref2.shellArguments, shellOverride = _ref2.shellOverride, runCommand = _ref2.runCommand, colors = _ref2.colors, cursorBlink = _ref2.cursorBlink, scrollback = _ref2.scrollback;
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      this.ptyProcess = this.forkPtyProcess(shellOverride, args);
      this.ptyProcess.on('term2:data', (function(_this) {
        return function(data) {
          return _this.term.write(data);
        };
      })(this));
      this.ptyProcess.on('term2:exit', (function(_this) {
        return function(data) {
          return _this.destroy();
        };
      })(this));
      colorsArray = colors.map(function(color) {
        return color.toHexString();
      });
      this.term = term = new Terminal({
        useStyle: false,
        screenKeys: false,
        colors: colorsArray,
        cursorBlink: cursorBlink,
        scrollback: scrollback,
        cols: cols,
        rows: rows
      });
      term.end = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      term.on("data", (function(_this) {
        return function(data) {
          return _this.input(data);
        };
      })(this));
      term.open(this.get(0));
      if (runCommand) {
        this.input("" + runCommand + os.EOL);
      }
      term.focus();
      this.attachEvents();
      return this.resizeToPane();
    };

    TermView.prototype.input = function(data) {
      this.ptyProcess.send({
        event: 'input',
        text: data
      });
      this.resizeToPane();
      return this.focusTerm();
    };

    TermView.prototype.resize = function(cols, rows) {
      return this.ptyProcess.send({
        event: 'resize',
        rows: rows,
        cols: cols
      });
    };

    TermView.prototype.titleVars = function() {
      return {
        bashName: last(this.opts.shell.split('/')),
        hostName: os.hostname(),
        platform: process.platform,
        home: process.env.HOME
      };
    };

    TermView.prototype.getTitle = function() {
      var titleTemplate;
      this.vars = this.titleVars();
      titleTemplate = this.opts.titleTemplate || "({{ bashName }})";
      return renderTemplate(titleTemplate, this.vars);
    };

    TermView.prototype.getIconName = function() {
      return "terminal";
    };

    TermView.prototype.attachEvents = function() {
      this.resizeToPane = this.resizeToPane.bind(this);
      this.attachResizeEvents();
      atom.commands.add("atom-workspace", "term2:paste", (function(_this) {
        return function() {
          return _this.paste();
        };
      })(this));
      return atom.commands.add("atom-workspace", "term2:copy", (function(_this) {
        return function() {
          return _this.copy();
        };
      })(this));
    };

    TermView.prototype.copy = function() {
      var lines, rawLines, rawText, text, textarea;
      if (this.term._selected) {
        textarea = this.term.getCopyTextarea();
        text = this.term.grabText(this.term._selected.x1, this.term._selected.x2, this.term._selected.y1, this.term._selected.y2);
      } else {
        rawText = this.term.context.getSelection().toString();
        rawLines = rawText.split(/\r?\n/g);
        lines = rawLines.map(function(line) {
          return line.replace(/\s/g, " ").trimRight();
        });
        text = lines.join("\n");
      }
      return atom.clipboard.write(text);
    };

    TermView.prototype.paste = function() {
      return this.input(atom.clipboard.read());
    };

    TermView.prototype.attachResizeEvents = function() {
      setTimeout(((function(_this) {
        return function() {
          return _this.resizeToPane();
        };
      })(this)), 10);
      this.on('focus', this.focus);
      return $(window).on('resize', (function(_this) {
        return function() {
          return _this.resizeToPane();
        };
      })(this));
    };

    TermView.prototype.detachResizeEvents = function() {
      this.off('focus', this.focus);
      return $(window).off('resize');
    };

    TermView.prototype.focus = function() {
      this.resizeToPane();
      this.focusTerm();
      return TermView.__super__.focus.apply(this, arguments);
    };

    TermView.prototype.focusTerm = function() {
      this.term.element.focus();
      return this.term.focus();
    };

    TermView.prototype.resizeToPane = function() {
      var cols, rows, _ref1;
      _ref1 = this.getDimensions(), cols = _ref1.cols, rows = _ref1.rows;
      if (!(cols > 0 && rows > 0)) {
        return;
      }
      if (!this.term) {
        return;
      }
      if (this.term.rows === rows && this.term.cols === cols) {
        return;
      }
      this.resize(cols, rows);
      this.term.resize(cols, rows);
      return atom.views.getView(atom.workspace).style.overflow = 'visible';
    };

    TermView.prototype.getDimensions = function() {
      var cols, fakeCol, rows;
      fakeCol = $("<span id='colSize'>&nbsp;</span>").css({
        visibility: 'hidden'
      });
      if (this.term) {
        this.find('.terminal').append(fakeCol);
        fakeCol = this.find(".terminal span#colSize");
        cols = Math.floor((this.width() / fakeCol.width()) || 9);
        rows = Math.floor((this.height() / fakeCol.height()) || 16);
        fakeCol.remove();
      } else {
        cols = Math.floor(this.width() / 7);
        rows = Math.floor(this.height() / 14);
      }
      return {
        cols: cols,
        rows: rows
      };
    };

    TermView.prototype.destroy = function() {
      var parentPane;
      this.detachResizeEvents();
      this.ptyProcess.terminate();
      this.term.destroy();
      parentPane = atom.workspace.getActivePane();
      if (parentPane.activeItem === this) {
        parentPane.removeItem(parentPane.activeItem);
      }
      return this.detach();
    };

    return TermView;

  })(View);

  module.exports = TermView;

}).call(this);
