(function() {
  var $, CompositeDisposable, Conflict, ConflictedEditor, Emitter, NavigationView, ResolverView, SideView, _, _ref;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  Conflict = require('./conflict').Conflict;

  SideView = require('./view/side-view').SideView;

  NavigationView = require('./view/navigation-view').NavigationView;

  ResolverView = require('./view/resolver-view').ResolverView;

  ConflictedEditor = (function() {
    function ConflictedEditor(state, pkg, editor) {
      this.state = state;
      this.pkg = pkg;
      this.editor = editor;
      this.subs = new CompositeDisposable;
      this.coveringViews = [];
      this.conflicts = [];
    }

    ConflictedEditor.prototype.mark = function() {
      var c, cv, _i, _j, _len, _len1, _ref1, _ref2;
      this.conflicts = Conflict.all(this.state, this.editor);
      this.coveringViews = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        this.coveringViews.push(new SideView(c.ours, this.editor));
        this.coveringViews.push(new NavigationView(c.navigator, this.editor));
        this.coveringViews.push(new SideView(c.theirs, this.editor));
        this.subs.add(c.onDidResolveConflict((function(_this) {
          return function() {
            var resolvedCount, unresolved, v;
            unresolved = (function() {
              var _j, _len1, _ref2, _results;
              _ref2 = this.coveringViews;
              _results = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                v = _ref2[_j];
                if (!v.conflict().isResolved()) {
                  _results.push(v);
                }
              }
              return _results;
            }).call(_this);
            resolvedCount = _this.conflicts.length - Math.floor(unresolved.length / 3);
            return _this.pkg.didResolveConflict({
              file: _this.editor.getPath(),
              total: _this.conflicts.length,
              resolved: resolvedCount,
              source: _this
            });
          };
        })(this)));
      }
      if (this.conflicts.length > 0) {
        atom.views.getView(this.editor).classList.add('conflicted');
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          cv = _ref2[_j];
          cv.decorate();
        }
        this.installEvents();
        return this.focusConflict(this.conflicts[0]);
      } else {
        this.pkg.didResolveConflict({
          file: this.editor.getPath(),
          total: 1,
          resolved: 1,
          source: this
        });
        return this.conflictsResolved();
      }
    };

    ConflictedEditor.prototype.installEvents = function() {
      this.subs.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.detectDirty();
        };
      })(this)));
      this.subs.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      this.subs.add(atom.commands.add('atom-text-editor', {
        'merge-conflicts:accept-current': (function(_this) {
          return function() {
            return _this.acceptCurrent();
          };
        })(this),
        'merge-conflicts:accept-ours': (function(_this) {
          return function() {
            return _this.acceptOurs();
          };
        })(this),
        'merge-conflicts:accept-theirs': (function(_this) {
          return function() {
            return _this.acceptTheirs();
          };
        })(this),
        'merge-conflicts:ours-then-theirs': (function(_this) {
          return function() {
            return _this.acceptOursThenTheirs();
          };
        })(this),
        'merge-conflicts:theirs-then-ours': (function(_this) {
          return function() {
            return _this.acceptTheirsThenOurs();
          };
        })(this),
        'merge-conflicts:next-unresolved': (function(_this) {
          return function() {
            return _this.nextUnresolved();
          };
        })(this),
        'merge-conflicts:previous-unresolved': (function(_this) {
          return function() {
            return _this.previousUnresolved();
          };
        })(this),
        'merge-conflicts:revert-current': (function(_this) {
          return function() {
            return _this.revertCurrent();
          };
        })(this)
      }));
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(_arg) {
          var file, resolved, total;
          total = _arg.total, resolved = _arg.resolved, file = _arg.file;
          if (file === _this.editor.getPath() && total === resolved) {
            return _this.conflictsResolved();
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidCompleteConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      return this.subs.add(this.pkg.onDidQuitConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
    };

    ConflictedEditor.prototype.cleanup = function() {
      var c, m, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      if (this.editor != null) {
        atom.views.getView(this.editor).classList.remove('conflicted');
      }
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = c.markers();
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          m = _ref2[_j];
          m.destroy();
        }
      }
      _ref3 = this.coveringViews;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        v.remove();
      }
      return this.subs.dispose();
    };

    ConflictedEditor.prototype.conflictsResolved = function() {
      return atom.workspace.addTopPanel({
        item: new ResolverView(this.editor, this.state, this.pkg)
      });
    };

    ConflictedEditor.prototype.detectDirty = function() {
      var c, potentials, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      potentials = [];
      _ref1 = this.editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          v = _ref2[_j];
          if (v.includesCursor(c)) {
            potentials.push(v);
          }
        }
      }
      _ref3 = _.uniq(potentials);
      _results = [];
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        _results.push(v.detectDirty());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptCurrent = function() {
      var duplicates, seen, side, sides, _i, _j, _len, _len1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      sides = this.active();
      duplicates = [];
      seen = {};
      for (_i = 0, _len = sides.length; _i < _len; _i++) {
        side = sides[_i];
        if (side.conflict in seen) {
          duplicates.push(side);
          duplicates.push(seen[side.conflict]);
        }
        seen[side.conflict] = side;
      }
      sides = _.difference(sides, duplicates);
      _results = [];
      for (_j = 0, _len1 = sides.length; _j < _len1; _j++) {
        side = sides[_j];
        _results.push(side.resolve());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptOurs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(side.conflict.ours.resolve());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptTheirs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(side.conflict.theirs.resolve());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptOursThenTheirs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(this.combineSides(side.conflict.ours, side.conflict.theirs));
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptTheirsThenOurs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(this.combineSides(side.conflict.theirs, side.conflict.ours));
      }
      return _results;
    };

    ConflictedEditor.prototype.nextUnresolved = function() {
      var c, final, firstAfter, lastCursor, n, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      final = _.last(this.active());
      if (final != null) {
        n = final.conflict.navigator.nextUnresolved();
        if (n != null) {
          return this.focusConflict(n);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        lastCursor = _.last(orderedCursors);
        if (lastCursor == null) {
          return;
        }
        pos = lastCursor.getBufferPosition();
        firstAfter = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isGreaterThanOrEqual(pos) && (firstAfter == null)) {
            firstAfter = c;
          }
        }
        if (firstAfter == null) {
          return;
        }
        if (firstAfter.isResolved()) {
          target = firstAfter.navigator.nextUnresolved();
        } else {
          target = firstAfter;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.previousUnresolved = function() {
      var c, firstCursor, initial, lastBefore, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      initial = _.first(this.active());
      if (initial != null) {
        p = initial.conflict.navigator.previousUnresolved();
        if (p != null) {
          return this.focusConflict(p);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        firstCursor = _.first(orderedCursors);
        if (firstCursor == null) {
          return;
        }
        pos = firstCursor.getBufferPosition();
        lastBefore = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isLessThanOrEqual(pos)) {
            lastBefore = c;
          }
        }
        if (lastBefore == null) {
          return;
        }
        if (lastBefore.isResolved()) {
          target = lastBefore.navigator.previousUnresolved();
        } else {
          target = lastBefore;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.revertCurrent = function() {
      var side, view, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push((function() {
          var _j, _len1, _ref2, _results1;
          _ref2 = this.coveringViews;
          _results1 = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            view = _ref2[_j];
            if (view.conflict() === side.conflict) {
              if (view.isDirty()) {
                _results1.push(view.revert());
              } else {
                _results1.push(void 0);
              }
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ConflictedEditor.prototype.active = function() {
      var c, matching, p, positions, _i, _j, _len, _len1, _ref1;
      positions = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          _results.push(c.getBufferPosition());
        }
        return _results;
      }).call(this);
      matching = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        for (_j = 0, _len1 = positions.length; _j < _len1; _j++) {
          p = positions[_j];
          if (c.ours.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.ours);
          }
          if (c.theirs.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.theirs);
          }
        }
      }
      return matching;
    };

    ConflictedEditor.prototype.combineSides = function(first, second) {
      var e, insertPoint, text;
      text = this.editor.getTextInBufferRange(second.marker.getBufferRange());
      e = first.marker.getBufferRange().end;
      insertPoint = this.editor.setTextInBufferRange([e, e], text).end;
      first.marker.setHeadBufferPosition(insertPoint);
      first.followingMarker.setTailBufferPosition(insertPoint);
      return first.resolve();
    };

    ConflictedEditor.prototype.focusConflict = function(conflict) {
      var st;
      st = conflict.ours.marker.getBufferRange().start;
      this.editor.scrollToBufferPosition(st, {
        center: true
      });
      return this.editor.setCursorBufferPosition(st, {
        autoscroll: false
      });
    };

    return ConflictedEditor;

  })();

  module.exports = {
    ConflictedEditor: ConflictedEditor
  };

}).call(this);
