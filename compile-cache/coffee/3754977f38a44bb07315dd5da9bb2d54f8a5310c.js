(function() {
  var exec, open_terminal, path, platform;

  exec = require('child_process').exec;

  path = require('path');

  platform = require('os').platform;


  /*
     Opens a terminal in the given directory, as specefied by the config
   */

  open_terminal = function(dirpath) {
    var app, args, cmdline, runDirectly, setWorkingDirectory, surpressDirArg;
    app = atom.config.get('atom-terminal.app');
    args = atom.config.get('atom-terminal.args');
    setWorkingDirectory = atom.config.get('atom-terminal.setWorkingDirectory');
    surpressDirArg = atom.config.get('atom-terminal.surpressDirectoryArgument');
    runDirectly = atom.config.get('atom-terminal.MacWinRunDirectly');
    cmdline = "\"" + app + "\" " + args;
    if (!surpressDirArg) {
      cmdline += " \"" + dirpath + "\"";
    }
    if (platform() === "darwin" && !runDirectly) {
      cmdline = "open -a " + cmdline;
    }
    if (platform() === "win32" && !runDirectly) {
      cmdline = "start \"\" " + cmdline;
    }
    console.log("atom-terminal executing: ", cmdline);
    if (setWorkingDirectory) {
      if (dirpath != null) {
        return exec(cmdline, {
          cwd: dirpath
        });
      }
    } else {
      if (dirpath != null) {
        return exec(cmdline);
      }
    }
  };

  module.exports = {
    activate: function() {
      atom.commands.add("atom-workspace", "atom-terminal:open", (function(_this) {
        return function() {
          return _this.open();
        };
      })(this));
      return atom.commands.add("atom-workspace", "atom-terminal:open-project-root", (function(_this) {
        return function() {
          return _this.openroot();
        };
      })(this));
    },
    open: function() {
      var editor, file, filepath, _ref;
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? (_ref = editor.buffer) != null ? _ref.file : void 0 : void 0;
      filepath = file != null ? file.path : void 0;
      if (filepath) {
        return open_terminal(path.dirname(filepath));
      }
    },
    openroot: function() {
      var _i, _len, _ref, _results;
      _ref = atom.project.getPaths();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        _results.push(open_terminal(path));
      }
      return _results;
    }
  };

  if (platform() === 'darwin') {
    module.exports.configDefaults = {
      app: 'Terminal.app',
      args: '',
      surpressDirectoryArgument: false,
      setWorkingDirectory: false,
      MacWinRunDirectly: false
    };
  } else if (platform() === 'win32') {
    module.exports.configDefaults = {
      app: 'C:\\Windows\\System32\\cmd.exe',
      args: '',
      surpressDirectoryArgument: false,
      setWorkingDirectory: true,
      MacWinRunDirectly: false
    };
  } else {
    module.exports.configDefaults = {
      app: '/usr/bin/x-terminal-emulator',
      args: '',
      surpressDirectoryArgument: true,
      setWorkingDirectory: true,
      MacWinRunDirectly: false
    };
  }

}).call(this);
