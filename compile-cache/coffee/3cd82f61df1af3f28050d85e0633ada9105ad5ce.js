(function() {
  var pty;

  pty = require('pty.js');

  module.exports = function(ptyCwd, sh, args) {
    var callback, cols, path, ptyProcess, rows, shell;
    callback = this.async();
    if (sh) {
      shell = sh;
    } else {
      if (process.platform === 'win32') {
        path = require('path');
        shell = path.resolve(process.env.SystemRoot, 'WindowsPowerShell', 'v1.0', 'powershell.exe');
      } else {
        shell = process.env.SHELL;
      }
    }
    if (process.platform === 'win32') {
      cols = 30;
      rows = 80;
    } else {
      cols = 80;
      rows = 30;
    }
    ptyProcess = pty.fork(shell, args, {
      name: 'xterm-256color',
      cols: cols,
      rows: rows,
      cwd: ptyCwd,
      env: process.env
    });
    ptyProcess.on('data', function(data) {
      return emit('term2:data', data);
    });
    ptyProcess.on('exit', function() {
      emit('term2:exit');
      return callback();
    });
    return process.on('message', function(_arg) {
      var cols, event, rows, text, _ref;
      _ref = _arg != null ? _arg : {}, event = _ref.event, cols = _ref.cols, rows = _ref.rows, text = _ref.text;
      switch (event) {
        case 'resize':
          return ptyProcess.resize(cols, rows);
        case 'input':
          return ptyProcess.write(text);
      }
    });
  };

}).call(this);
