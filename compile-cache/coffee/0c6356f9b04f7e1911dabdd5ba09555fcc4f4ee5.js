(function() {
  var GitBridge, MergeState;

  GitBridge = require('./git-bridge').GitBridge;

  MergeState = (function() {
    function MergeState(conflicts, repo, isRebase) {
      this.conflicts = conflicts;
      this.repo = repo;
      this.isRebase = isRebase;
    }

    MergeState.prototype.conflictPaths = function() {
      var c, _i, _len, _ref, _results;
      _ref = this.conflicts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.path);
      }
      return _results;
    };

    MergeState.prototype.reread = function(callback) {
      return GitBridge.withConflicts(this.repo, (function(_this) {
        return function(err, conflicts) {
          _this.conflicts = conflicts;
          return callback(err, _this);
        };
      })(this));
    };

    MergeState.prototype.isEmpty = function() {
      return this.conflicts.length === 0;
    };

    MergeState.read = function(repo, callback) {
      var isr;
      isr = GitBridge.isRebasing();
      return GitBridge.withConflicts(repo, function(err, cs) {
        if (err != null) {
          return callback(err, null);
        } else {
          return callback(null, new MergeState(cs, repo, isr));
        }
      });
    };

    return MergeState;

  })();

  module.exports = {
    MergeState: MergeState
  };

}).call(this);
