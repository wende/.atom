/**
 * pty_win.js
 * Copyright (c) 2012-2015, Christopher Jeffrey, Peter Sunde (MIT License)
 */

var net = require("net");
var path = require("path");
var extend = require("extend");
var inherits = require("util").inherits;
var BaseTerminal = require("./pty").Terminal;
var pty = require("../build/Release/pty.node");

// Counter of number of "pipes" created so far.
var pipeIncr = 0;

/**
 * Agent. Internal class.
 *
 * Everytime a new pseudo terminal is created it is contained
 * within agent.exe. When this process is started there are two
 * available named pipes (control and data socket).
 */

function Agent(file, args, env, cwd, cols, rows, debug) {
  var self = this;

  // Increment the number of pipes created.
  pipeIncr++;

  // Unique identifier per pipe created.
  var timestamp = Date.now();

  // The data pipe is the direct connection to the forked terminal.
  this.dataPipe = "\\\\.\\pipe\\winpty-data-" + pipeIncr + "" + timestamp;

  // Dummy socket for awaiting `ready` event.
  this.ptySocket = new net.Socket();

  // Create terminal pipe IPC channel and forward
  // to a local unix socket.
  this.ptyDataPipe = net.createServer(function (socket) {

    // Default socket encoding.
    socket.setEncoding("utf8");

    // Pause until `ready` event is emitted.
    socket.pause();

    // Sanitize input variable.
    file = file;
    args = args.join(" ");
    cwd = path.resolve(cwd);

    // Start terminal session.
    pty.startProcess(self.pid, file, args, env, cwd);

    // Emit ready event.
    self.ptySocket.emit("ready_datapipe", socket);
  }).listen(this.dataPipe);

  // Open pty session.
  var term = pty.open(self.dataPipe, cols, rows, debug);

  // Terminal pid.
  this.pid = term.pid;

  // Not available on windows.
  this.fd = term.fd;

  // Generated incremental number that has no real purpose besides
  // using it as a terminal id.
  this.pty = term.pty;
}

/**
 * Terminal
 */

/*
var pty = require('./');

var term = pty.fork('cmd.exe', [], {
  name: 'Windows Shell',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env,
  debug: true
});

term.on('data', function(data) {
  console.log(data);
});
*/

function Terminal(file, args, opt) {

  var self = this,
      env,
      cwd,
      name,
      cols,
      rows,
      term,
      agent,
      debug;

  // Backward compatibility.
  if (typeof args === "string") {
    opt = {
      name: arguments[1],
      cols: arguments[2],
      rows: arguments[3],
      cwd: process.env.HOME
    };
    args = [];
  }

  // Arguments.
  args = args || [];
  file = file || "cmd.exe";
  opt = opt || {};

  env = extend({}, opt.env);

  cols = opt.cols || 80;
  rows = opt.rows || 30;
  cwd = opt.cwd || process.cwd();
  name = opt.name || env.TERM || "Windows Shell";
  debug = opt.debug || false;

  env.TERM = name;

  // Initialize environment variables.
  env = environ(env);

  // If the terminal is ready
  this.isReady = false;

  // Functions that need to run after `ready` event is emitted.
  this.deferreds = [];

  // Create new termal.
  this.agent = new Agent(file, args, env, cwd, cols, rows, debug);

  // The dummy socket is used so that we can defer everything
  // until its available.
  this.socket = this.agent.ptySocket;

  // The terminal socket when its available
  this.dataPipe = null;

  // Not available until `ready` event emitted.
  this.pid = this.agent.pid;
  this.fd = this.agent.fd;
  this.pty = this.agent.pty;

  // The forked windows terminal is not available
  // until `ready` event is emitted.
  this.socket.on("ready_datapipe", function (socket) {

    // Set terminal socket
    self.dataPipe = socket;

    // These events needs to be forwarded.
    ["connect", "data", "end", "timeout", "drain"].forEach(function (event) {
      self.dataPipe.on(event, function (data) {

        // Wait until the first data event is fired
        // then we can run deferreds.
        if (!self.isReady && event == "data") {

          // Terminal is now ready and we can
          // avoid having to defer method calls.
          self.isReady = true;

          // Execute all deferred methods
          self.deferreds.forEach(function (fn) {
            // NB! In order to ensure that `this` has all
            // its references updated any variable that
            // need to be available in `this` before
            // the deferred is run has to be declared
            // above this forEach statement.
            fn.run();
          });

          // Reset
          self.deferreds = [];
        }

        // Emit to dummy socket
        self.socket.emit(event, data);
      });
    });

    // Resume socket.
    self.dataPipe.resume();

    // Shutdown if `error` event is emitted.
    self.dataPipe.on("error", function (err) {

      // Close terminal session.
      self._close();

      // EIO, happens when someone closes our child
      // process: the only process in the terminal.
      // node < 0.6.14: errno 5
      // node >= 0.6.14: read EIO
      if (err.code) {
        if (~err.code.indexOf("errno 5") || ~err.code.indexOf("EIO")) return;
      }

      // Throw anything else.
      if (self.listeners("error").length < 2) {
        throw err;
      }
    });

    // Cleanup after the socket is closed.
    self.dataPipe.on("close", function () {
      Terminal.total--;
      self.emit("exit", null);
      self._close();
    });
  });

  this.file = file;
  this.name = name;
  this.cols = cols;
  this.rows = rows;

  this.readable = true;
  this.writable = true;

  Terminal.total++;
}

Terminal.fork = Terminal.spawn = Terminal.createTerminal = function (file, args, opt) {
  return new Terminal(file, args, opt);
};

// Inherit from pty.js
inherits(Terminal, BaseTerminal);

// Keep track of the total
// number of terminals for
// the process.
Terminal.total = 0;

/**
 * Events
 */

/**
 * openpty
 */

Terminal.open = function () {
  throw new Error("open() not supported on windows, use Fork() instead.");
};

/**
 * Events
 */

Terminal.prototype.write = function (data) {
  defer(this, function () {
    this.dataPipe.write(data);
  });
};

/**
 * TTY
 */

Terminal.prototype.resize = function (cols, rows) {
  defer(this, function () {

    cols = cols || 80;
    rows = rows || 24;

    this.cols = cols;
    this.rows = rows;

    pty.resize(this.pid, cols, rows);
  });
};

Terminal.prototype.destroy = function () {
  defer(this, function () {
    this.kill();
  });
};

Terminal.prototype.kill = function (sig) {
  defer(this, function () {
    if (sig !== undefined) {
      throw new Error("Signals not supported on windows.");
    }
    this._close();
    pty.kill(this.pid);
  });
};

Terminal.prototype.__defineGetter__("process", function () {
  return this.name;
});

/**
 * Helpers
 */

function defer(terminal, deferredFn) {

  // Ensure that this method is only used within Terminal class.
  if (!(terminal instanceof Terminal)) {
    throw new Error("Must be instanceof Terminal");
  }

  // If the terminal is ready, execute.
  if (terminal.isReady) {
    deferredFn.apply(terminal, null);
    return;
  }

  // Queue until terminal is ready.
  terminal.deferreds.push({
    run: function run() {
      // Run deffered.
      deferredFn.apply(terminal, null);
    }
  });
}

function environ(env) {
  var keys = Object.keys(env || {}),
      l = keys.length,
      i = 0,
      pairs = [];

  for (; i < l; i++) {
    pairs.push(keys[i] + "=" + env[keys[i]]);
  }

  return pairs;
}

/**
 * Expose
 */

module.exports = exports = Terminal;
exports.Terminal = Terminal;
exports.native = pty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWVybGFuZy9saWIvc2VydmVyL3B0eS5qcy9saWIvcHR5X3dpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUtBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDeEMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUM3QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7O0FBRy9DLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQVVqQixTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdEQsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOzs7QUFHaEIsVUFBUSxFQUFFLENBQUM7OztBQUdYLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7O0FBRzNCLE1BQUksQ0FBQyxRQUFRLEdBQUcsMkJBQTJCLEdBQUcsUUFBUSxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUM7OztBQUd4RSxNQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7O0FBSWxDLE1BQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLE1BQU0sRUFBRTs7O0FBR3BELFVBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENB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Q0FBQyxFQUFFLEVBQUU7QUFDakIsU0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzFDOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7OztBQU1ELE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUNwQyxPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUM1QixPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiIvaG9tZS9pcmFhc3RhLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1lcmxhbmcvbGliL3NlcnZlci9wdHkuanMvbGliL3B0eV93aW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIHB0eV93aW4uanNcbiAqIENvcHlyaWdodCAoYykgMjAxMi0yMDE1LCBDaHJpc3RvcGhlciBKZWZmcmV5LCBQZXRlciBTdW5kZSAoTUlUIExpY2Vuc2UpXG4gKi9cblxudmFyIG5ldCA9IHJlcXVpcmUoJ25ldCcpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHM7XG52YXIgQmFzZVRlcm1pbmFsID0gcmVxdWlyZSgnLi9wdHknKS5UZXJtaW5hbDtcbnZhciBwdHkgPSByZXF1aXJlKCcuLi9idWlsZC9SZWxlYXNlL3B0eS5ub2RlJyk7XG5cbi8vIENvdW50ZXIgb2YgbnVtYmVyIG9mIFwicGlwZXNcIiBjcmVhdGVkIHNvIGZhci5cbnZhciBwaXBlSW5jciA9IDA7XG5cbi8qKlxuICogQWdlbnQuIEludGVybmFsIGNsYXNzLlxuICpcbiAqIEV2ZXJ5dGltZSBhIG5ldyBwc2V1ZG8gdGVybWluYWwgaXMgY3JlYXRlZCBpdCBpcyBjb250YWluZWRcbiAqIHdpdGhpbiBhZ2VudC5leGUuIFdoZW4gdGhpcyBwcm9jZXNzIGlzIHN0YXJ0ZWQgdGhlcmUgYXJlIHR3b1xuICogYXZhaWxhYmxlIG5hbWVkIHBpcGVzIChjb250cm9sIGFuZCBkYXRhIHNvY2tldCkuXG4gKi9cblxuZnVuY3Rpb24gQWdlbnQoZmlsZSwgYXJncywgZW52LCBjd2QsIGNvbHMsIHJvd3MsIGRlYnVnKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBJbmNyZW1lbnQgdGhlIG51bWJlciBvZiBwaXBlcyBjcmVhdGVkLlxuICBwaXBlSW5jcisrO1xuXG4gIC8vIFVuaXF1ZSBpZGVudGlmaWVyIHBlciBwaXBlIGNyZWF0ZWQuXG4gIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gIC8vIFRoZSBkYXRhIHBpcGUgaXMgdGhlIGRpcmVjdCBjb25uZWN0aW9uIHRvIHRoZSBmb3JrZWQgdGVybWluYWwuXG4gIHRoaXMuZGF0YVBpcGUgPSAnXFxcXFxcXFwuXFxcXHBpcGVcXFxcd2lucHR5LWRhdGEtJyArIHBpcGVJbmNyICsgJycgKyB0aW1lc3RhbXA7XG5cbiAgLy8gRHVtbXkgc29ja2V0IGZvciBhd2FpdGluZyBgcmVhZHlgIGV2ZW50LlxuICB0aGlzLnB0eVNvY2tldCA9IG5ldyBuZXQuU29ja2V0KCk7XG5cbiAgLy8gQ3JlYXRlIHRlcm1pbmFsIHBpcGUgSVBDIGNoYW5uZWwgYW5kIGZvcndhcmRcbiAgLy8gdG8gYSBsb2NhbCB1bml4IHNvY2tldC5cbiAgdGhpcy5wdHlEYXRhUGlwZSA9IG5ldC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24gKHNvY2tldCkge1xuXG4gICAgLy8gRGVmYXVsdCBzb2NrZXQgZW5jb2RpbmcuXG4gICAgc29ja2V0LnNldEVuY29kaW5nKCd1dGY4Jyk7XG5cbiAgICAvLyBQYXVzZSB1bnRpbCBgcmVhZHlgIGV2ZW50IGlzIGVtaXR0ZWQuXG4gICAgc29ja2V0LnBhdXNlKCk7XG5cbiAgICAvLyBTYW5pdGl6ZSBpbnB1dCB2YXJpYWJsZS5cbiAgICBmaWxlID0gZmlsZTtcbiAgICBhcmdzID0gYXJncy5qb2luKCcgJyk7XG4gICAgY3dkID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cbiAgICAvLyBTdGFydCB0ZXJtaW5hbCBzZXNzaW9uLlxuICAgIHB0eS5zdGFydFByb2Nlc3Moc2VsZi5waWQsIGZpbGUsIGFyZ3MsIGVudiwgY3dkKTtcblxuICAgIC8vIEVtaXQgcmVhZHkgZXZlbnQuXG4gICAgc2VsZi5wdHlTb2NrZXQuZW1pdCgncmVhZHlfZGF0YXBpcGUnLCBzb2NrZXQpO1xuXG4gIH0pLmxpc3Rlbih0aGlzLmRhdGFQaXBlKTtcblxuICAvLyBPcGVuIHB0eSBzZXNzaW9uLlxuICB2YXIgdGVybSA9IHB0eS5vcGVuKHNlbGYuZGF0YVBpcGUsIGNvbHMsIHJvd3MsIGRlYnVnKTtcblxuICAvLyBUZXJtaW5hbCBwaWQuXG4gIHRoaXMucGlkID0gdGVybS5waWQ7XG5cbiAgLy8gTm90IGF2YWlsYWJsZSBvbiB3aW5kb3dzLlxuICB0aGlzLmZkID0gdGVybS5mZDtcblxuICAvLyBHZW5lcmF0ZWQgaW5jcmVtZW50YWwgbnVtYmVyIHRoYXQgaGFzIG5vIHJlYWwgcHVycG9zZSBiZXNpZGVzXG4gIC8vIHVzaW5nIGl0IGFzIGEgdGVybWluYWwgaWQuXG4gIHRoaXMucHR5ID0gdGVybS5wdHk7XG59XG5cbi8qKlxuICogVGVybWluYWxcbiAqL1xuXG4vKlxudmFyIHB0eSA9IHJlcXVpcmUoJy4vJyk7XG5cbnZhciB0ZXJtID0gcHR5LmZvcmsoJ2NtZC5leGUnLCBbXSwge1xuICBuYW1lOiAnV2luZG93cyBTaGVsbCcsXG4gIGNvbHM6IDgwLFxuICByb3dzOiAzMCxcbiAgY3dkOiBwcm9jZXNzLmVudi5IT01FLFxuICBlbnY6IHByb2Nlc3MuZW52LFxuICBkZWJ1ZzogdHJ1ZVxufSk7XG5cbnRlcm0ub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gIGNvbnNvbGUubG9nKGRhdGEpO1xufSk7XG4qL1xuXG5mdW5jdGlvbiBUZXJtaW5hbChmaWxlLCBhcmdzLCBvcHQpIHtcblxuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBlbnYsIGN3ZCwgbmFtZSwgY29scywgcm93cywgdGVybSwgYWdlbnQsIGRlYnVnO1xuXG4gIC8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXG4gIGlmICh0eXBlb2YgYXJncyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7XG4gICAgICBuYW1lOiBhcmd1bWVudHNbMV0sXG4gICAgICBjb2xzOiBhcmd1bWVudHNbMl0sXG4gICAgICByb3dzOiBhcmd1bWVudHNbM10sXG4gICAgICBjd2Q6IHByb2Nlc3MuZW52LkhPTUVcbiAgICB9O1xuICAgIGFyZ3MgPSBbXTtcbiAgfVxuXG4gIC8vIEFyZ3VtZW50cy5cbiAgYXJncyA9IGFyZ3MgfHwgW107XG4gIGZpbGUgPSBmaWxlIHx8ICdjbWQuZXhlJztcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIGVudiA9IGV4dGVuZCh7fSwgb3B0LmVudik7XG5cbiAgY29scyA9IG9wdC5jb2xzIHx8IDgwO1xuICByb3dzID0gb3B0LnJvd3MgfHwgMzA7XG4gIGN3ZCA9IG9wdC5jd2QgfHwgcHJvY2Vzcy5jd2QoKTtcbiAgbmFtZSA9IG9wdC5uYW1lIHx8IGVudi5URVJNIHx8ICdXaW5kb3dzIFNoZWxsJztcbiAgZGVidWcgPSBvcHQuZGVidWcgfHwgZmFsc2U7XG5cbiAgZW52LlRFUk0gPSBuYW1lO1xuXG4gIC8vIEluaXRpYWxpemUgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICBlbnYgPSBlbnZpcm9uKGVudik7XG5cbiAgLy8gSWYgdGhlIHRlcm1pbmFsIGlzIHJlYWR5XG4gIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuXG4gIC8vIEZ1bmN0aW9ucyB0aGF0IG5lZWQgdG8gcnVuIGFmdGVyIGByZWFkeWAgZXZlbnQgaXMgZW1pdHRlZC5cbiAgdGhpcy5kZWZlcnJlZHMgPSBbXTtcblxuICAvLyBDcmVhdGUgbmV3IHRlcm1hbC5cbiAgdGhpcy5hZ2VudCA9IG5ldyBBZ2VudChmaWxlLCBhcmdzLCBlbnYsIGN3ZCwgY29scywgcm93cywgZGVidWcpO1xuXG4gIC8vIFRoZSBkdW1teSBzb2NrZXQgaXMgdXNlZCBzbyB0aGF0IHdlIGNhbiBkZWZlciBldmVyeXRoaW5nXG4gIC8vIHVudGlsIGl0cyBhdmFpbGFibGUuXG4gIHRoaXMuc29ja2V0ID0gdGhpcy5hZ2VudC5wdHlTb2NrZXQ7XG5cbiAgLy8gVGhlIHRlcm1pbmFsIHNvY2tldCB3aGVuIGl0cyBhdmFpbGFibGVcbiAgdGhpcy5kYXRhUGlwZSA9IG51bGw7XG5cbiAgLy8gTm90IGF2YWlsYWJsZSB1bnRpbCBgcmVhZHlgIGV2ZW50IGVtaXR0ZWQuXG4gIHRoaXMucGlkID0gdGhpcy5hZ2VudC5waWQ7XG4gIHRoaXMuZmQgPSB0aGlzLmFnZW50LmZkO1xuICB0aGlzLnB0eSA9IHRoaXMuYWdlbnQucHR5O1xuXG4gIC8vIFRoZSBmb3JrZWQgd2luZG93cyB0ZXJtaW5hbCBpcyBub3QgYXZhaWxhYmxlXG4gIC8vIHVudGlsIGByZWFkeWAgZXZlbnQgaXMgZW1pdHRlZC5cbiAgdGhpcy5zb2NrZXQub24oJ3JlYWR5X2RhdGFwaXBlJywgZnVuY3Rpb24gKHNvY2tldCkge1xuXG4gICAgLy8gU2V0IHRlcm1pbmFsIHNvY2tldFxuICAgIHNlbGYuZGF0YVBpcGUgPSBzb2NrZXQ7XG5cbiAgICAvLyBUaGVzZSBldmVudHMgbmVlZHMgdG8gYmUgZm9yd2FyZGVkLlxuICAgIFsnY29ubmVjdCcsICdkYXRhJywgJ2VuZCcsICd0aW1lb3V0JywgJ2RyYWluJ10uZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xuICAgICAgc2VsZi5kYXRhUGlwZS5vbihldmVudCwgZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgIC8vIFdhaXQgdW50aWwgdGhlIGZpcnN0IGRhdGEgZXZlbnQgaXMgZmlyZWRcbiAgICAgICAgLy8gdGhlbiB3ZSBjYW4gcnVuIGRlZmVycmVkcy5cbiAgICAgICAgaWYoIXNlbGYuaXNSZWFkeSAmJiBldmVudCA9PSAnZGF0YScpIHtcblxuICAgICAgICAgIC8vIFRlcm1pbmFsIGlzIG5vdyByZWFkeSBhbmQgd2UgY2FuXG4gICAgICAgICAgLy8gYXZvaWQgaGF2aW5nIHRvIGRlZmVyIG1ldGhvZCBjYWxscy5cbiAgICAgICAgICBzZWxmLmlzUmVhZHkgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gRXhlY3V0ZSBhbGwgZGVmZXJyZWQgbWV0aG9kc1xuICAgICAgICAgIHNlbGYuZGVmZXJyZWRzLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIC8vIE5CISBJbiBvcmRlciB0byBlbnN1cmUgdGhhdCBgdGhpc2AgaGFzIGFsbFxuICAgICAgICAgICAgLy8gaXRzIHJlZmVyZW5jZXMgdXBkYXRlZCBhbnkgdmFyaWFibGUgdGhhdFxuICAgICAgICAgICAgLy8gbmVlZCB0byBiZSBhdmFpbGFibGUgaW4gYHRoaXNgIGJlZm9yZVxuICAgICAgICAgICAgLy8gdGhlIGRlZmVycmVkIGlzIHJ1biBoYXMgdG8gYmUgZGVjbGFyZWRcbiAgICAgICAgICAgIC8vIGFib3ZlIHRoaXMgZm9yRWFjaCBzdGF0ZW1lbnQuXG4gICAgICAgICAgICBmbi5ydW4oKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFJlc2V0XG4gICAgICAgICAgc2VsZi5kZWZlcnJlZHMgPSBbXTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW1pdCB0byBkdW1teSBzb2NrZXRcbiAgICAgICAgc2VsZi5zb2NrZXQuZW1pdChldmVudCwgZGF0YSk7XG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gUmVzdW1lIHNvY2tldC5cbiAgICBzZWxmLmRhdGFQaXBlLnJlc3VtZSgpO1xuXG4gICAgLy8gU2h1dGRvd24gaWYgYGVycm9yYCBldmVudCBpcyBlbWl0dGVkLlxuICAgIHNlbGYuZGF0YVBpcGUub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAvLyBDbG9zZSB0ZXJtaW5hbCBzZXNzaW9uLlxuICAgICAgc2VsZi5fY2xvc2UoKTtcblxuICAgICAgLy8gRUlPLCBoYXBwZW5zIHdoZW4gc29tZW9uZSBjbG9zZXMgb3VyIGNoaWxkXG4gICAgICAvLyBwcm9jZXNzOiB0aGUgb25seSBwcm9jZXNzIGluIHRoZSB0ZXJtaW5hbC5cbiAgICAgIC8vIG5vZGUgPCAwLjYuMTQ6IGVycm5vIDVcbiAgICAgIC8vIG5vZGUgPj0gMC42LjE0OiByZWFkIEVJT1xuICAgICAgaWYgKGVyci5jb2RlKSB7XG4gICAgICAgIGlmICh+ZXJyLmNvZGUuaW5kZXhPZignZXJybm8gNScpIHx8IH5lcnIuY29kZS5pbmRleE9mKCdFSU8nKSkgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaHJvdyBhbnl0aGluZyBlbHNlLlxuICAgICAgaWYgKHNlbGYubGlzdGVuZXJzKCdlcnJvcicpLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICAvLyBDbGVhbnVwIGFmdGVyIHRoZSBzb2NrZXQgaXMgY2xvc2VkLlxuICAgIHNlbGYuZGF0YVBpcGUub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgVGVybWluYWwudG90YWwtLTtcbiAgICAgIHNlbGYuZW1pdCgnZXhpdCcsIG51bGwpO1xuICAgICAgc2VsZi5fY2xvc2UoKTtcbiAgICB9KTtcblxuICB9KTtcblxuICB0aGlzLmZpbGUgPSBmaWxlO1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmNvbHMgPSBjb2xzO1xuICB0aGlzLnJvd3MgPSByb3dzO1xuXG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcblxuICBUZXJtaW5hbC50b3RhbCsrO1xufVxuXG5UZXJtaW5hbC5mb3JrID1cblRlcm1pbmFsLnNwYXduID1cblRlcm1pbmFsLmNyZWF0ZVRlcm1pbmFsID0gZnVuY3Rpb24gKGZpbGUsIGFyZ3MsIG9wdCkge1xuICByZXR1cm4gbmV3IFRlcm1pbmFsKGZpbGUsIGFyZ3MsIG9wdCk7XG59O1xuXG4vLyBJbmhlcml0IGZyb20gcHR5LmpzXG5pbmhlcml0cyhUZXJtaW5hbCwgQmFzZVRlcm1pbmFsKTtcblxuLy8gS2VlcCB0cmFjayBvZiB0aGUgdG90YWxcbi8vIG51bWJlciBvZiB0ZXJtaW5hbHMgZm9yXG4vLyB0aGUgcHJvY2Vzcy5cblRlcm1pbmFsLnRvdGFsID0gMDtcblxuLyoqXG4gKiBFdmVudHNcbiAqL1xuXG4vKipcbiAqIG9wZW5wdHlcbiAqL1xuXG5UZXJtaW5hbC5vcGVuID0gZnVuY3Rpb24gKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJvcGVuKCkgbm90IHN1cHBvcnRlZCBvbiB3aW5kb3dzLCB1c2UgRm9yaygpIGluc3RlYWQuXCIpO1xufTtcblxuLyoqXG4gKiBFdmVudHNcbiAqL1xuXG5UZXJtaW5hbC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gIGRlZmVyKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGF0YVBpcGUud3JpdGUoZGF0YSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBUVFlcbiAqL1xuXG5UZXJtaW5hbC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKGNvbHMsIHJvd3MpIHtcbiAgZGVmZXIodGhpcywgZnVuY3Rpb24oKSB7XG5cbiAgICBjb2xzID0gY29scyB8fCA4MDtcbiAgICByb3dzID0gcm93cyB8fCAyNDtcblxuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5yb3dzID0gcm93cztcblxuICAgIHB0eS5yZXNpemUodGhpcy5waWQsIGNvbHMsIHJvd3MpO1xuICB9KTtcbn07XG5cblRlcm1pbmFsLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICBkZWZlcih0aGlzLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmtpbGwoKTtcbiAgfSk7XG59O1xuXG5UZXJtaW5hbC5wcm90b3R5cGUua2lsbCA9IGZ1bmN0aW9uIChzaWcpIHtcbiAgZGVmZXIodGhpcywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNpZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaWduYWxzIG5vdCBzdXBwb3J0ZWQgb24gd2luZG93cy5cIik7XG4gICAgfVxuICAgIHRoaXMuX2Nsb3NlKCk7XG4gICAgcHR5LmtpbGwodGhpcy5waWQpO1xuICB9KTtcbn07XG5cblRlcm1pbmFsLnByb3RvdHlwZS5fX2RlZmluZUdldHRlcl9fKCdwcm9jZXNzJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5uYW1lO1xufSk7XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5cbmZ1bmN0aW9uIGRlZmVyKHRlcm1pbmFsLCBkZWZlcnJlZEZuKSB7XG5cbiAgLy8gRW5zdXJlIHRoYXQgdGhpcyBtZXRob2QgaXMgb25seSB1c2VkIHdpdGhpbiBUZXJtaW5hbCBjbGFzcy5cbiAgaWYgKCEodGVybWluYWwgaW5zdGFuY2VvZiBUZXJtaW5hbCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGluc3RhbmNlb2YgVGVybWluYWxcIik7XG4gIH1cblxuICAvLyBJZiB0aGUgdGVybWluYWwgaXMgcmVhZHksIGV4ZWN1dGUuXG4gIGlmICh0ZXJtaW5hbC5pc1JlYWR5KSB7XG4gICAgZGVmZXJyZWRGbi5hcHBseSh0ZXJtaW5hbCwgbnVsbCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUXVldWUgdW50aWwgdGVybWluYWwgaXMgcmVhZHkuXG4gIHRlcm1pbmFsLmRlZmVycmVkcy5wdXNoKHtcbiAgICBydW46IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gUnVuIGRlZmZlcmVkLlxuICAgICAgZGVmZXJyZWRGbi5hcHBseSh0ZXJtaW5hbCwgbnVsbCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZW52aXJvbihlbnYpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhlbnYgfHwge30pXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBwYWlycyA9IFtdO1xuXG4gIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgcGFpcnMucHVzaChrZXlzW2ldICsgJz0nICsgZW52W2tleXNbaV1dKTtcbiAgfVxuXG4gIHJldHVybiBwYWlycztcbn1cblxuLyoqXG4gKiBFeHBvc2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBUZXJtaW5hbDtcbmV4cG9ydHMuVGVybWluYWwgPSBUZXJtaW5hbDtcbmV4cG9ydHMubmF0aXZlID0gcHR5O1xuIl19