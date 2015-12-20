(function() {
  var AtomicEmacs, EditorState, Mark;

  AtomicEmacs = require('../lib/atomic-emacs').AtomicEmacs;

  Mark = require('../lib/mark');

  EditorState = require('./editor-state');

  describe("AtomicEmacs", function() {
    beforeEach(function() {
      return waitsForPromise((function(_this) {
        return function() {
          return atom.workspace.open().then(function(editor) {
            _this.editor = editor;
            _this.event = {
              target: function() {
                return {
                  getModel: function() {
                    return _this.editor;
                  }
                };
              }
            };
            _this.atomicEmacs = new AtomicEmacs();
            return _this.atomicEmacs.editor = function(_) {
              return _this.editor;
            };
          });
        };
      })(this));
    });
    describe("atomic-emacs:upcase-word-or-region", function() {
      describe("when there is no selection", function() {
        it("upcases the word after each cursor (if any)", function() {
          EditorState.set(this.editor, "[0]Aa bb\ncc[1] dd ee[2]\nff [3]");
          this.atomicEmacs.upcaseWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("AA[0] bb\ncc DD[1] ee\nFF[2] [3]");
        });
        return it("merges any cursors that coincide", function() {
          EditorState.set(this.editor, "[0]aa[1]");
          this.atomicEmacs.upcaseWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("AA[0]");
        });
      });
      return describe("when there are selections", function() {
        return it("upcases each word in each selection", function() {
          EditorState.set(this.editor, "aa (0)bb cc[0] dd\nee f[1]ffgg(1)g");
          this.atomicEmacs.upcaseWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("aa (0)BB CC[0] dd\nee f[1]FFGG(1)g");
        });
      });
    });
    describe("atomic-emacs:downcase-word-or-region", function() {
      describe("when there is no selection", function() {
        it("downcases the word after each cursor (if any)", function() {
          EditorState.set(this.editor, "[0]aA BB\nCC[1] DD EE[2]\nFF [3]");
          this.atomicEmacs.downcaseWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("aa[0] BB\nCC dd[1] EE\nff[2] [3]");
        });
        return it("merges any cursors that coincide", function() {
          EditorState.set(this.editor, "[0]AA[1]");
          this.atomicEmacs.downcaseWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("aa[0]");
        });
      });
      return describe("when there are selections", function() {
        return it("downcases each word in each selection", function() {
          EditorState.set(this.editor, "AA (0)BB CC[0] DD\nEE F[1]FFGG(1)G");
          this.atomicEmacs.downcaseWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("AA (0)bb cc[0] DD\nEE F[1]ffgg(1)G");
        });
      });
    });
    describe("atomic-emacs:capitalize-word-or-region", function() {
      describe("when there is no selection", function() {
        it("capitalizes the word after each cursor (if any)", function() {
          EditorState.set(this.editor, "[0]aA bb\ncc[1] dd ee[2]\nff [3]");
          this.atomicEmacs.capitalizeWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("Aa[0] bb\ncc Dd[1] ee\nFf[2] [3]");
        });
        return it("merges any cursors that coincide", function() {
          EditorState.set(this.editor, "[0]aa[1]");
          this.atomicEmacs.capitalizeWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("Aa[0]");
        });
      });
      return describe("when there are selections", function() {
        return it("capitalizes each word in each selection", function() {
          EditorState.set(this.editor, "aa (0)bb CC[0] dd\nee f[1]FFGG(1)G");
          this.atomicEmacs.capitalizeWordOrRegion(this.event);
          return expect(EditorState.get(this.editor)).toEqual("aa (0)Bb Cc[0] dd\nee f[1]Ffgg(1)G");
        });
      });
    });
    describe("atomic-emacs:transpose-chars", function() {
      it("transposes the current character with the one after it", function() {
        EditorState.set(this.editor, "ab[0]cd");
        this.atomicEmacs.transposeChars(this.event);
        return expect(EditorState.get(this.editor)).toEqual("acb[0]d");
      });
      it("transposes the last two characters of the line at the end of a line", function() {
        EditorState.set(this.editor, "abc[0]\ndef");
        this.atomicEmacs.transposeChars(this.event);
        return expect(EditorState.get(this.editor)).toEqual("acb[0]\ndef");
      });
      it("transposes the first character with the newline at the start of a line", function() {
        EditorState.set(this.editor, "abc\n[0]def");
        this.atomicEmacs.transposeChars(this.event);
        return expect(EditorState.get(this.editor)).toEqual("abcd\n[0]ef");
      });
      it("does nothing at the beginning of the buffer", function() {
        EditorState.set(this.editor, "[0]abcd");
        this.atomicEmacs.transposeChars(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]abcd");
      });
      return it("transposes the last two characters at the end of the buffer", function() {
        EditorState.set(this.editor, "abcd[0]");
        this.atomicEmacs.transposeChars(this.event);
        return expect(EditorState.get(this.editor)).toEqual("abdc[0]");
      });
    });
    describe("atomic-emacs:transpose-words", function() {
      it("transposes the current word with the one after it", function() {
        EditorState.set(this.editor, "aaa b[0]bb .\tccc ddd");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa ccc .\tbbb[0] ddd");
      });
      it("transposes the previous and next words if at the end of a word", function() {
        EditorState.set(this.editor, "aaa bbb[0] .\tccc ddd");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa ccc .\tbbb[0] ddd");
      });
      it("transposes the previous and next words if at the beginning of a word", function() {
        EditorState.set(this.editor, "aaa bbb .\t[0]ccc ddd");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa ccc .\tbbb[0] ddd");
      });
      it("transposes the previous and next words if in between words", function() {
        EditorState.set(this.editor, "aaa bbb .[0]\tccc ddd");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa ccc .\tbbb[0] ddd");
      });
      it("moves to the start of the last word if in the last word", function() {
        EditorState.set(this.editor, "aaa bbb .\tcc[0]c ");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa bbb .\tccc[0] ");
      });
      it("transposes the last two words if at the start of the last word", function() {
        EditorState.set(this.editor, "aaa bbb .\t[0]ccc");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa ccc .\tbbb[0]");
      });
      it("transposes the first two words if at the start of the buffer", function() {
        EditorState.set(this.editor, "[0]aaa .\tbbb ccc");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual("bbb .\taaa[0] ccc");
      });
      return it("moves to the start of the word if it's the only word in the buffer", function() {
        EditorState.set(this.editor, " \taaa [0]\t");
        this.atomicEmacs.transposeWords(this.event);
        return expect(EditorState.get(this.editor)).toEqual(" \taaa[0] \t");
      });
    });
    describe("atomic-emacs:transpose-lines", function() {
      it("transposes this line with the previous one, and moves to the next line", function() {
        EditorState.set(this.editor, "aaa\nb[0]bb\nccc\n");
        this.atomicEmacs.transposeLines(this.event);
        return expect(EditorState.get(this.editor)).toEqual("bbb\naaa\n[0]ccc\n");
      });
      it("pretends it's on the second line if it's on the first", function() {
        EditorState.set(this.editor, "a[0]aa\nbbb\nccc\n");
        this.atomicEmacs.transposeLines(this.event);
        return expect(EditorState.get(this.editor)).toEqual("bbb\naaa\n[0]ccc\n");
      });
      it("creates a newline at end of file if necessary", function() {
        EditorState.set(this.editor, "aaa\nb[0]bb");
        this.atomicEmacs.transposeLines(this.event);
        return expect(EditorState.get(this.editor)).toEqual("bbb\naaa\n[0]");
      });
      it("still transposes if at the end of the buffer after a trailing newline", function() {
        EditorState.set(this.editor, "aaa\nbbb\n[0]");
        this.atomicEmacs.transposeLines(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa\n\nbbb\n[0]");
      });
      it("inserts a blank line at the top if there's only one line with a trailing newline", function() {
        EditorState.set(this.editor, "a[0]aa\n");
        this.atomicEmacs.transposeLines(this.event);
        return expect(EditorState.get(this.editor)).toEqual("\naaa\n[0]");
      });
      return it("inserts a blank line at the top if there's only one line with no trailing newline", function() {
        EditorState.set(this.editor, "a[0]aa");
        this.atomicEmacs.transposeLines(this.event);
        return expect(EditorState.get(this.editor)).toEqual("\naaa\n[0]");
      });
    });
    describe("atomic-emacs:delete-horizontal-space", function() {
      it("deletes all horizontal space around each cursor", function() {
        EditorState.set(this.editor, "a [0]\tb c [1]\td");
        this.atomicEmacs.deleteHorizontalSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a[0]b c[1]d");
      });
      it("deletes all horizontal space to the beginning of the buffer if in leading space", function() {
        EditorState.set(this.editor, " [0]\ta");
        this.atomicEmacs.deleteHorizontalSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]a");
      });
      it("deletes all horizontal space to the end of the buffer if in trailing space", function() {
        EditorState.set(this.editor, "a [0]\t");
        this.atomicEmacs.deleteHorizontalSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a[0]");
      });
      it("deletes all text if the buffer only contains horizontal spaces", function() {
        EditorState.set(this.editor, " [0]\t");
        this.atomicEmacs.deleteHorizontalSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]");
      });
      return it("does not modify the buffer if there is no horizontal space around the cursor", function() {
        EditorState.set(this.editor, "a[0]b");
        this.atomicEmacs.deleteHorizontalSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a[0]b");
      });
    });
    describe("atomic-emacs:kill-word", function() {
      it("deletes from the cursor to the end of the word if inside a word", function() {
        EditorState.set(this.editor, "aaa b[0]bb ccc");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa b[0] ccc");
      });
      it("deletes the word in front of the cursor if at the beginning of a word", function() {
        EditorState.set(this.editor, "aaa [0]bbb ccc");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa [0] ccc");
      });
      it("deletes the next word if at the end of a word", function() {
        EditorState.set(this.editor, "aaa[0] bbb ccc");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa[0] ccc");
      });
      it("deletes the next word if between words", function() {
        EditorState.set(this.editor, "aaa [0] bbb ccc");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa [0] ccc");
      });
      it("does nothing if at the end of the buffer", function() {
        EditorState.set(this.editor, "aaa bbb ccc[0]");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa bbb ccc[0]");
      });
      it("deletes the trailing space in front of the cursor if at the end of the buffer", function() {
        EditorState.set(this.editor, "aaa bbb ccc [0] ");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa bbb ccc [0]");
      });
      it("deletes any selected text", function() {
        EditorState.set(this.editor, "aaa b(0)b[0]b ccc");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa b[0]b ccc");
      });
      return it("operates on multiple cursors", function() {
        EditorState.set(this.editor, "aaa b[0]bb c[1]cc ddd");
        this.atomicEmacs.killWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa b[0] c[1] ddd");
      });
    });
    describe("atomic-emacs:backward-kill-word", function() {
      it("deletes from the cursor to the beginning of the word if inside a word", function() {
        EditorState.set(this.editor, "aaa bb[0]b ccc");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa [0]b ccc");
      });
      it("deletes the word behind the cursor if at the end of a word", function() {
        EditorState.set(this.editor, "aaa bbb[0] ccc");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa [0] ccc");
      });
      it("deletes the previous word if at the beginning of a word", function() {
        EditorState.set(this.editor, "aaa bbb [0]ccc");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa [0]ccc");
      });
      it("deletes the previous word if between words", function() {
        EditorState.set(this.editor, "aaa bbb [0] ccc");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa [0] ccc");
      });
      it("does nothing if at the beginning of the buffer", function() {
        EditorState.set(this.editor, "[0]aaa bbb ccc");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]aaa bbb ccc");
      });
      it("deletes the leading space behind the cursor if at the beginning of the buffer", function() {
        EditorState.set(this.editor, " [0] aaa bbb ccc");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0] aaa bbb ccc");
      });
      it("deletes any selected text", function() {
        EditorState.set(this.editor, "aaa b(0)b[0]b ccc");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa b[0]b ccc");
      });
      return it("operates on multiple cursors", function() {
        EditorState.set(this.editor, "aaa bb[0]b cc[1]c ddd");
        this.atomicEmacs.backwardKillWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aaa [0]b [1]c ddd");
      });
    });
    describe("atomic-emacs:just-one-space", function() {
      it("replaces all horizontal space around each cursor with one space", function() {
        EditorState.set(this.editor, "a [0]\tb c [1]\td");
        this.atomicEmacs.justOneSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a [0]b c [1]d");
      });
      it("replaces all horizontal space at the beginning of the buffer with one space if in leading space", function() {
        EditorState.set(this.editor, " [0]\ta");
        this.atomicEmacs.justOneSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual(" [0]a");
      });
      it("replaces all horizontal space at the end of the buffer with one space if in trailing space", function() {
        EditorState.set(this.editor, "a [0]\t");
        this.atomicEmacs.justOneSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a [0]");
      });
      it("replaces all text with one space if the buffer only contains horizontal spaces", function() {
        EditorState.set(this.editor, " [0]\t");
        this.atomicEmacs.justOneSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual(" [0]");
      });
      return it("does not modify the buffer if there is already exactly one space at around the cursor", function() {
        EditorState.set(this.editor, "a[0]b");
        this.atomicEmacs.justOneSpace(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a [0]b");
      });
    });
    describe("atomic_emacs:set-mark", function() {
      return it("sets and activates the mark of all cursors", function() {
        var cursor0, cursor1, point, _ref;
        EditorState.set(this.editor, "[0].[1]");
        _ref = this.editor.getCursors(), cursor0 = _ref[0], cursor1 = _ref[1];
        this.atomicEmacs.setMark(this.event);
        expect(Mark["for"](cursor0).isActive()).toBe(true);
        point = Mark["for"](cursor0).getBufferPosition();
        expect([point.row, point.column]).toEqual([0, 0]);
        expect(Mark["for"](cursor1).isActive()).toBe(true);
        point = Mark["for"](cursor1).getBufferPosition();
        return expect([point.row, point.column]).toEqual([0, 1]);
      });
    });
    describe("atomic-emacs:keyboard-quit", function() {
      return it("deactivates all marks", function() {
        var c, m, mark0, mark1, _i, _len, _ref, _ref1;
        EditorState.set(this.editor, "[0].[1]");
        _ref = (function() {
          var _i, _len, _ref, _results;
          _ref = this.editor.getCursors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            c = _ref[_i];
            _results.push(Mark["for"](c));
          }
          return _results;
        }).call(this), mark0 = _ref[0], mark1 = _ref[1];
        _ref1 = [mark0, mark1];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          m = _ref1[_i];
          m.activate();
        }
        this.atomicEmacs.keyboardQuit(this.event);
        return expect(mark0.isActive()).toBe(false);
      });
    });
    describe("atomic-emacs:backward-char", function() {
      it("moves the cursor backward one character", function() {
        EditorState.set(this.editor, "x[0]");
        this.atomicEmacs.backwardChar(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]x");
      });
      it("does nothing at the start of the buffer", function() {
        EditorState.set(this.editor, "[0]x");
        this.atomicEmacs.backwardChar(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]x");
      });
      it("extends an active selection if the mark is set", function() {
        EditorState.set(this.editor, "ab[0]c");
        this.atomicEmacs.setMark(this.event);
        this.atomicEmacs.backwardChar(this.event);
        expect(EditorState.get(this.editor)).toEqual("a[0]b(0)c");
        this.atomicEmacs.backwardChar(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]ab(0)c");
      });
      return it("aborts key binding if flag is set", function() {
        var event;
        atom.config.set('atomic-emacs.useNativeNavigationKeys', true);
        EditorState.set(this.editor, "x[0]");
        event = jasmine.createSpyObj('event', ['abortKeyBinding']);
        this.atomicEmacs.backwardChar(event);
        expect(event.abortKeyBinding).toHaveBeenCalled();
        return expect(EditorState.get(this.editor)).toEqual("x[0]");
      });
    });
    describe("atomic-emacs:close-other-panes", function() {
      return it("should close all inactive panes", function() {
        var pane1, pane2, pane3;
        pane1 = atom.workspace.getActivePane();
        pane2 = pane1.splitRight();
        pane3 = pane2.splitRight();
        pane2.activate();
        this.atomicEmacs.closeOtherPanes();
        expect(pane1.isDestroyed()).toEqual(true);
        expect(pane2.isDestroyed()).toEqual(false);
        return expect(pane3.isDestroyed()).toEqual(true);
      });
    });
    describe("atomic-emacs:forward-char", function() {
      it("moves the cursor forward one character", function() {
        EditorState.set(this.editor, "[0]x");
        this.atomicEmacs.forwardChar(this.event);
        return expect(EditorState.get(this.editor)).toEqual("x[0]");
      });
      it("does nothing at the end of the buffer", function() {
        EditorState.set(this.editor, "x[0]");
        this.atomicEmacs.forwardChar(this.event);
        return expect(EditorState.get(this.editor)).toEqual("x[0]");
      });
      it("extends an active selection if the mark is set", function() {
        EditorState.set(this.editor, "a[0]bc");
        this.atomicEmacs.setMark(this.event);
        this.atomicEmacs.forwardChar(this.event);
        expect(EditorState.get(this.editor)).toEqual("a(0)b[0]c");
        this.atomicEmacs.forwardChar(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a(0)bc[0]");
      });
      return it("aborts key binding if flag is set", function() {
        var event;
        atom.config.set('atomic-emacs.useNativeNavigationKeys', true);
        EditorState.set(this.editor, "x[0]");
        event = jasmine.createSpyObj('event', ['abortKeyBinding']);
        this.atomicEmacs.forwardChar(event);
        expect(event.abortKeyBinding).toHaveBeenCalled();
        return expect(EditorState.get(this.editor)).toEqual("x[0]");
      });
    });
    describe("atomic-emacs:backward-word", function() {
      it("moves all cursors to the beginning of the current word if in a word", function() {
        EditorState.set(this.editor, "aa b[0]b c[1]c");
        this.atomicEmacs.backwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa [0]bb [1]cc");
      });
      it("moves to the beginning of the previous word if between words", function() {
        EditorState.set(this.editor, "aa bb [0] cc");
        this.atomicEmacs.backwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa [0]bb  cc");
      });
      it("moves to the beginning of the previous word if at the start of a word", function() {
        EditorState.set(this.editor, "aa bb [0]cc");
        this.atomicEmacs.backwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa [0]bb cc");
      });
      it("moves to the beginning of the buffer if at the start of the first word", function() {
        EditorState.set(this.editor, " [0]aa bb");
        this.atomicEmacs.backwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0] aa bb");
      });
      return it("moves to the beginning of the buffer if before the start of the first word", function() {
        EditorState.set(this.editor, " [0] aa bb");
        this.atomicEmacs.backwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]  aa bb");
      });
    });
    describe("atomic-emacs:forward-word", function() {
      it("moves all cursors to the end of the current word if in a word", function() {
        EditorState.set(this.editor, "a[0]a b[1]b cc");
        this.atomicEmacs.forwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa[0] bb[1] cc");
      });
      it("moves to the end of the next word if between words", function() {
        EditorState.set(this.editor, "aa [0] bb cc");
        this.atomicEmacs.forwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa  bb[0] cc");
      });
      it("moves to the end of the next word if at the end of a word", function() {
        EditorState.set(this.editor, "aa[0] bb cc");
        this.atomicEmacs.forwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa bb[0] cc");
      });
      it("moves to the end of the buffer if at the end of the last word", function() {
        EditorState.set(this.editor, "aa bb[0] ");
        this.atomicEmacs.forwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa bb [0]");
      });
      return it("moves to the end of the buffer if past the end of the last word", function() {
        EditorState.set(this.editor, "aa bb [0] ");
        this.atomicEmacs.forwardWord(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa bb  [0]");
      });
    });
    describe("atomic-emacs:forward-sexp", function() {
      it("moves all cursors forward one symbolic expression", function() {
        EditorState.set(this.editor, "[0]  aa\n[1](bb cc)\n");
        this.atomicEmacs.forwardSexp(this.event);
        return expect(EditorState.get(this.editor)).toEqual("  aa[0]\n(bb cc)[1]\n");
      });
      return it("merges cursors that coincide", function() {
        EditorState.set(this.editor, "[0] [1]aa");
        this.atomicEmacs.forwardSexp(this.event);
        return expect(EditorState.get(this.editor)).toEqual(" aa[0]");
      });
    });
    describe("atomic-emacs:backward-sexp", function() {
      it("moves all cursors backward one symbolic expression", function() {
        EditorState.set(this.editor, "aa [0]\n(bb cc)[1]\n");
        this.atomicEmacs.backwardSexp(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]aa \n[1](bb cc)\n");
      });
      return it("merges cursors that coincide", function() {
        EditorState.set(this.editor, "aa[0] [1]");
        this.atomicEmacs.backwardSexp(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]aa ");
      });
    });
    describe("atomic-emacs:back-to-indentation", function() {
      it("moves cursors forward to the first character if in leading space", function() {
        EditorState.set(this.editor, "[0]  aa\n [1] bb\n");
        this.atomicEmacs.backToIndentation(this.event);
        return expect(EditorState.get(this.editor)).toEqual("  [0]aa\n  [1]bb\n");
      });
      it("moves cursors back to the first character if past it", function() {
        EditorState.set(this.editor, "  a[0]a\n  bb[1]\n");
        this.atomicEmacs.backToIndentation(this.event);
        return expect(EditorState.get(this.editor)).toEqual("  [0]aa\n  [1]bb\n");
      });
      it("leaves cursors alone if already there", function() {
        EditorState.set(this.editor, "  [0]aa\n[1]  bb\n");
        this.atomicEmacs.backToIndentation(this.event);
        return expect(EditorState.get(this.editor)).toEqual("  [0]aa\n  [1]bb\n");
      });
      it("moves cursors to the end of their lines if they only contain spaces", function() {
        EditorState.set(this.editor, " [0] \n  [1]\n");
        this.atomicEmacs.backToIndentation(this.event);
        return expect(EditorState.get(this.editor)).toEqual("  [0]\n  [1]\n");
      });
      return it("merges cursors after moving", function() {
        EditorState.set(this.editor, "  a[0]a[1]\n");
        this.atomicEmacs.backToIndentation(this.event);
        return expect(EditorState.get(this.editor)).toEqual("  [0]aa\n");
      });
    });
    describe("atomic-emacs:previous-line", function() {
      it("moves the cursor up one line", function() {
        EditorState.set(this.editor, "ab\na[0]b\n");
        this.atomicEmacs.previousLine(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a[0]b\nab\n");
      });
      it("goes to the start of the line if already at the top of the buffer", function() {
        EditorState.set(this.editor, "x[0]");
        this.atomicEmacs.previousLine(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]x");
      });
      it("extends an active selection if the mark is set", function() {
        EditorState.set(this.editor, "ab\nab\na[0]b\n");
        this.atomicEmacs.setMark(this.event);
        this.atomicEmacs.previousLine(this.event);
        expect(EditorState.get(this.editor)).toEqual("ab\na[0]b\na(0)b\n");
        this.atomicEmacs.previousLine(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a[0]b\nab\na(0)b\n");
      });
      return it("aborts key binding if flag is set", function() {
        var event;
        atom.config.set('atomic-emacs.useNativeNavigationKeys', true);
        EditorState.set(this.editor, "x[0]");
        event = jasmine.createSpyObj('event', ['abortKeyBinding']);
        this.atomicEmacs.previousLine(event);
        expect(event.abortKeyBinding).toHaveBeenCalled();
        return expect(EditorState.get(this.editor)).toEqual("x[0]");
      });
    });
    describe("atomic-emacs:next-line", function() {
      it("moves the cursor down one line", function() {
        EditorState.set(this.editor, "a[0]b\nab\n");
        this.atomicEmacs.nextLine(this.event);
        return expect(EditorState.get(this.editor)).toEqual("ab\na[0]b\n");
      });
      it("goes to the end of the line if already at the bottom of the buffer", function() {
        EditorState.set(this.editor, "[0]x");
        this.atomicEmacs.nextLine(this.event);
        return expect(EditorState.get(this.editor)).toEqual("x[0]");
      });
      it("extends an active selection if the mark is set", function() {
        EditorState.set(this.editor, "a[0]b\nab\nab\n");
        this.atomicEmacs.setMark(this.event);
        this.atomicEmacs.nextLine(this.event);
        expect(EditorState.get(this.editor)).toEqual("a(0)b\na[0]b\nab\n");
        this.atomicEmacs.nextLine(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a(0)b\nab\na[0]b\n");
      });
      return it("aborts key binding if flag is set", function() {
        var event;
        atom.config.set('atomic-emacs.useNativeNavigationKeys', true);
        EditorState.set(this.editor, "a[0]b\nab\nab\n");
        event = jasmine.createSpyObj('event', ['abortKeyBinding']);
        this.atomicEmacs.nextLine(event);
        expect(event.abortKeyBinding).toHaveBeenCalled();
        return expect(EditorState.get(this.editor)).toEqual("a[0]b\nab\nab\n");
      });
    });
    describe("atomic-emacs:backward-paragraph", function() {
      it("moves back to an empty line", function() {
        EditorState.set(this.editor, "a\n\nb\nc\n[0]d");
        this.atomicEmacs.backwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\n[0]\nb\nc\nd");
      });
      it("moves back to the beginning of a line with only whitespace", function() {
        EditorState.set(this.editor, "a\n \t\nb\nc\nd[0]");
        this.atomicEmacs.backwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\n[0] \t\nb\nc\nd");
      });
      it("stops if it reaches the beginning of the buffer", function() {
        EditorState.set(this.editor, "a\nb\n[0]c");
        this.atomicEmacs.backwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]a\nb\nc");
      });
      it("does not stop on its own line", function() {
        EditorState.set(this.editor, "a\n\nb\nc\n[0]\n");
        this.atomicEmacs.backwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\n[0]\nb\nc\n\n");
      });
      it("moves to the beginning of the line if on the first line", function() {
        EditorState.set(this.editor, "a[0]a\n");
        this.atomicEmacs.backwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0]aa\n");
      });
      return it("moves all cursors, and merges cursors that coincide", function() {
        EditorState.set(this.editor, "a\n\nb\nc\n[0]\nd\n[1]e\n[2]");
        this.atomicEmacs.backwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\n[0]\nb\nc\n[1]\nd\ne\n");
      });
    });
    describe("atomic-emacs:forward-paragraph", function() {
      it("moves forward to an empty line", function() {
        EditorState.set(this.editor, "a\n[0]b\nc\n\nd");
        this.atomicEmacs.forwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\nb\nc\n[0]\nd");
      });
      it("moves forward to the beginning of a line with only whitespace", function() {
        EditorState.set(this.editor, "a\n[0]b\nc\n \t\nd");
        this.atomicEmacs.forwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\nb\nc\n[0] \t\nd");
      });
      it("stops if it reaches the end of the buffer", function() {
        EditorState.set(this.editor, "a\n[0]b\nc");
        this.atomicEmacs.forwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\nb\nc[0]");
      });
      it("does not stop on its own line", function() {
        EditorState.set(this.editor, "a\n[0]\nb\nc\n\nd");
        this.atomicEmacs.forwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\n\nb\nc\n[0]\nd");
      });
      it("moves to the end of the line if on the last line", function() {
        EditorState.set(this.editor, "a[0]a");
        this.atomicEmacs.forwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("aa[0]");
      });
      return it("moves all cursors, and merges cursors that coincide", function() {
        EditorState.set(this.editor, "a\n[0]\nb\nc\n[1]\nd\n[2]e\n");
        this.atomicEmacs.forwardParagraph(this.event);
        return expect(EditorState.get(this.editor)).toEqual("a\n\nb\nc\n[0]\nd\ne\n[1]");
      });
    });
    describe("atomic-emacs:exchange-point-and-mark", function() {
      return it("exchanges all cursors with their marks", function() {
        var cursor, _i, _len, _ref;
        EditorState.set(this.editor, "[0]..[1].");
        _ref = this.editor.getCursors();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cursor = _ref[_i];
          Mark["for"](cursor);
          cursor.moveRight();
        }
        this.atomicEmacs.exchangePointAndMark(this.event);
        return expect(EditorState.get(this.editor)).toEqual("[0].(0).[1].(1)");
      });
    });
    return describe("atomic-emacs:delete-indentation", function() {
      it("joins the current line with the previous one if at the start of the line", function() {
        EditorState.set(this.editor, "aa \n[0] bb\ncc");
        this.atomicEmacs.deleteIndentation();
        return expect(EditorState.get(this.editor)).toEqual("aa[0] bb\ncc");
      });
      it("does exactly the same thing if at the end of the line", function() {
        EditorState.set(this.editor, "aa \n bb[0]\ncc");
        this.atomicEmacs.deleteIndentation();
        return expect(EditorState.get(this.editor)).toEqual("aa[0] bb\ncc");
      });
      return it("joins the two empty lines if they're both blank", function() {
        EditorState.set(this.editor, "aa\n\n[0]\nbb");
        this.atomicEmacs.deleteIndentation();
        return expect(EditorState.get(this.editor)).toEqual("aa\n[0]\nbb");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3Mvc3BlYy9hdG9taWMtZW1hY3Mtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7O0FBQUEsRUFBQyxjQUFlLE9BQUEsQ0FBUSxxQkFBUixFQUFmLFdBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFDLE1BQUQsR0FBQTtBQUN6QixZQUFBLEtBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsS0FBRCxHQUFTO0FBQUEsY0FBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO3VCQUFHO0FBQUEsa0JBQUMsUUFBQSxFQUFVLFNBQUEsR0FBQTsyQkFBRyxLQUFDLENBQUEsT0FBSjtrQkFBQSxDQUFYO2tCQUFIO2NBQUEsQ0FBUjthQURULENBQUE7QUFBQSxZQUVBLEtBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFBLENBRm5CLENBQUE7bUJBR0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLEdBQXNCLFNBQUMsQ0FBRCxHQUFBO3FCQUFPLEtBQUMsQ0FBQSxPQUFSO1lBQUEsRUFKRztVQUFBLENBQTNCLEVBRGM7UUFBQSxFQUFB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

//# sourceURL=/home/iraasta/.atom/packages/atomic-emacs/spec/atomic-emacs-spec.coffee
