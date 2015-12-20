(function() {
  var CursorTools, EditorState, rangeCoordinates;

  EditorState = require('./editor-state');

  CursorTools = require('../lib/cursor-tools');

  rangeCoordinates = function(range) {
    if (range) {
      return [range.start.row, range.start.column, range.end.row, range.end.column];
    } else {
      return range;
    }
  };

  describe("CursorTools", function() {
    beforeEach(function() {
      return waitsForPromise((function(_this) {
        return function() {
          return atom.workspace.open().then(function(editor) {
            _this.editor = editor;
            return _this.cursorTools = new CursorTools(editor.getLastCursor());
          });
        };
      })(this));
    });
    describe("locateBackward", function() {
      it("returns the range of the previous match if found", function() {
        var range;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        range = this.cursorTools.locateBackward(/x+/);
        expect(rangeCoordinates(range)).toEqual([0, 3, 0, 5]);
        return expect(EditorState.get(this.editor)).toEqual("xx xx [0] xx xx");
      });
      return it("returns null if no match is found", function() {
        var range;
        EditorState.set(this.editor, "[0]");
        range = this.cursorTools.locateBackward(/x+/);
        expect(range).toBe(null);
        return expect(EditorState.get(this.editor)).toEqual("[0]");
      });
    });
    describe("locateForward", function() {
      it("returns the range of the next match if found", function() {
        var range;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        range = this.cursorTools.locateForward(/x+/);
        expect(rangeCoordinates(range)).toEqual([0, 7, 0, 9]);
        return expect(EditorState.get(this.editor)).toEqual("xx xx [0] xx xx");
      });
      return it("returns null if no match is found", function() {
        var range;
        EditorState.set(this.editor, "[0]");
        range = this.cursorTools.locateForward(/x+/);
        expect(range).toBe(null);
        return expect(EditorState.get(this.editor)).toEqual("[0]");
      });
    });
    describe("locateWordCharacterBackward", function() {
      it("returns the range of the previous word character if found", function() {
        var range;
        EditorState.set(this.editor, " xx  [0]");
        range = this.cursorTools.locateWordCharacterBackward();
        expect(rangeCoordinates(range)).toEqual([0, 2, 0, 3]);
        return expect(EditorState.get(this.editor)).toEqual(" xx  [0]");
      });
      return it("returns null if there are no word characters behind", function() {
        var range;
        EditorState.set(this.editor, "  [0]");
        range = this.cursorTools.locateWordCharacterBackward();
        expect(range).toBe(null);
        return expect(EditorState.get(this.editor)).toEqual("  [0]");
      });
    });
    describe("locateWordCharacterForward", function() {
      it("returns the range of the next word character if found", function() {
        var range;
        EditorState.set(this.editor, "[0]  xx ");
        range = this.cursorTools.locateWordCharacterForward();
        expect(rangeCoordinates(range)).toEqual([0, 2, 0, 3]);
        return expect(EditorState.get(this.editor)).toEqual("[0]  xx ");
      });
      return it("returns null if there are no word characters ahead", function() {
        var range;
        EditorState.set(this.editor, "[0]  ");
        range = this.cursorTools.locateWordCharacterForward();
        expect(range).toBe(null);
        return expect(EditorState.get(this.editor)).toEqual("[0]  ");
      });
    });
    describe("locateNonWordCharacterBackward", function() {
      it("returns the range of the previous nonword character if found", function() {
        var range;
        EditorState.set(this.editor, "x  xx[0]");
        range = this.cursorTools.locateNonWordCharacterBackward();
        expect(rangeCoordinates(range)).toEqual([0, 2, 0, 3]);
        return expect(EditorState.get(this.editor)).toEqual("x  xx[0]");
      });
      return it("returns null if there are no nonword characters behind", function() {
        var range;
        EditorState.set(this.editor, "xx[0]");
        range = this.cursorTools.locateNonWordCharacterBackward();
        expect(range).toBe(null);
        return expect(EditorState.get(this.editor)).toEqual("xx[0]");
      });
    });
    describe("locateNonWordCharacterForward", function() {
      it("returns the range of the next nonword character if found", function() {
        var range;
        EditorState.set(this.editor, "[0]xx  x");
        range = this.cursorTools.locateNonWordCharacterForward();
        expect(rangeCoordinates(range)).toEqual([0, 2, 0, 3]);
        return expect(EditorState.get(this.editor)).toEqual("[0]xx  x");
      });
      return it("returns null if there are no nonword characters ahead", function() {
        var range;
        EditorState.set(this.editor, "[0]xx");
        range = this.cursorTools.locateNonWordCharacterForward();
        expect(range).toBe(null);
        return expect(EditorState.get(this.editor)).toEqual("[0]xx");
      });
    });
    describe("goToMatchStartBackward", function() {
      it("moves to the start of the previous match and returns true if a match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchStartBackward(/x+/);
        expect(result).toBe(true);
        return expect(EditorState.get(this.editor)).toEqual("xx [0]xx  xx xx");
      });
      return it("does not move and returns false if no match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchStartBackward(/y+/);
        expect(result).toBe(false);
        return expect(EditorState.get(this.editor)).toEqual("xx xx [0] xx xx");
      });
    });
    describe("goToMatchStartForward", function() {
      it("moves to the start of the next match and returns true if a match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchStartForward(/x+/);
        expect(result).toBe(true);
        return expect(EditorState.get(this.editor)).toEqual("xx xx  [0]xx xx");
      });
      return it("does not move and returns false if no match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchStartForward(/y+/);
        expect(result).toBe(false);
        return expect(EditorState.get(this.editor)).toEqual("xx xx [0] xx xx");
      });
    });
    describe("goToMatchEndBackward", function() {
      it("moves to the end of the previous match and returns true if a match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchEndBackward(/x+/);
        expect(result).toBe(true);
        return expect(EditorState.get(this.editor)).toEqual("xx xx[0]  xx xx");
      });
      return it("does not move and returns false if no match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchEndBackward(/y+/);
        expect(result).toBe(false);
        return expect(EditorState.get(this.editor)).toEqual("xx xx [0] xx xx");
      });
    });
    describe("goToMatchEndForward", function() {
      it("moves to the end of the next match and returns true if a match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchEndForward(/x+/);
        expect(result).toBe(true);
        return expect(EditorState.get(this.editor)).toEqual("xx xx  xx[0] xx");
      });
      return it("does not move and returns false if no match is found", function() {
        var result;
        EditorState.set(this.editor, "xx xx [0] xx xx");
        result = this.cursorTools.goToMatchEndForward(/y+/);
        expect(result).toBe(false);
        return expect(EditorState.get(this.editor)).toEqual("xx xx [0] xx xx");
      });
    });
    describe("skipCharactersBackward", function() {
      it("moves backward over the given characters", function() {
        EditorState.set(this.editor, "x..x..[0]");
        this.cursorTools.skipCharactersBackward('.');
        return expect(EditorState.get(this.editor)).toEqual("x..x[0]..");
      });
      it("does not move if the previous character is not in the list", function() {
        EditorState.set(this.editor, "..x[0]");
        this.cursorTools.skipCharactersBackward('.');
        return expect(EditorState.get(this.editor)).toEqual("..x[0]");
      });
      return it("moves to the beginning of the buffer if all prior characters are in the list", function() {
        EditorState.set(this.editor, "..[0]");
        this.cursorTools.skipCharactersBackward('.');
        return expect(EditorState.get(this.editor)).toEqual("[0]..");
      });
    });
    describe("skipCharactersForward", function() {
      it("moves forward over the given characters", function() {
        EditorState.set(this.editor, "[0]..x..x");
        this.cursorTools.skipCharactersForward('.');
        return expect(EditorState.get(this.editor)).toEqual("..[0]x..x");
      });
      it("does not move if the next character is not in the list", function() {
        EditorState.set(this.editor, "[0]x..");
        this.cursorTools.skipCharactersForward('.');
        return expect(EditorState.get(this.editor)).toEqual("[0]x..");
      });
      return it("moves to the end of the buffer if all following characters are in the list", function() {
        EditorState.set(this.editor, "[0]..");
        this.cursorTools.skipCharactersForward('.');
        return expect(EditorState.get(this.editor)).toEqual("..[0]");
      });
    });
    describe("skipWordCharactersBackward", function() {
      it("moves over any word characters backward", function() {
        EditorState.set(this.editor, "abc abc[0]abc abc");
        this.cursorTools.skipWordCharactersBackward();
        return expect(EditorState.get(this.editor)).toEqual("abc [0]abcabc abc");
      });
      it("does not move if the previous character is not a word character", function() {
        EditorState.set(this.editor, "abc abc [0]");
        this.cursorTools.skipWordCharactersBackward();
        return expect(EditorState.get(this.editor)).toEqual("abc abc [0]");
      });
      return it("moves to the beginning of the buffer if all prior characters are word characters", function() {
        EditorState.set(this.editor, "abc[0]");
        this.cursorTools.skipWordCharactersBackward();
        return expect(EditorState.get(this.editor)).toEqual("[0]abc");
      });
    });
    describe("skipWordCharactersForward", function() {
      it("moves over any word characters forward", function() {
        EditorState.set(this.editor, "abc abc[0]abc abc");
        this.cursorTools.skipWordCharactersForward();
        return expect(EditorState.get(this.editor)).toEqual("abc abcabc[0] abc");
      });
      it("does not move if the next character is not a word character", function() {
        EditorState.set(this.editor, "[0] abc abc");
        this.cursorTools.skipWordCharactersForward();
        return expect(EditorState.get(this.editor)).toEqual("[0] abc abc");
      });
      return it("moves to the end of the buffer if all following characters are word characters", function() {
        EditorState.set(this.editor, "[0]abc");
        this.cursorTools.skipWordCharactersForward();
        return expect(EditorState.get(this.editor)).toEqual("abc[0]");
      });
    });
    describe("skipNonWordCharactersBackward", function() {
      it("moves over any nonword characters backward", function() {
        EditorState.set(this.editor, "   x   [0]   x   ");
        this.cursorTools.skipNonWordCharactersBackward();
        return expect(EditorState.get(this.editor)).toEqual("   x[0]      x   ");
      });
      it("does not move if the previous character is a word character", function() {
        EditorState.set(this.editor, "   x   x[0]");
        this.cursorTools.skipNonWordCharactersBackward();
        return expect(EditorState.get(this.editor)).toEqual("   x   x[0]");
      });
      return it("moves to the beginning of the buffer if all prior characters are nonword characters", function() {
        EditorState.set(this.editor, "   [0]");
        this.cursorTools.skipNonWordCharactersBackward();
        return expect(EditorState.get(this.editor)).toEqual("[0]   ");
      });
    });
    describe("skipNonWordCharactersForward", function() {
      it("moves over any word characters forward", function() {
        EditorState.set(this.editor, "   x   [0]   x   ");
        this.cursorTools.skipNonWordCharactersForward();
        return expect(EditorState.get(this.editor)).toEqual("   x      [0]x   ");
      });
      it("does not move if the next character is a word character", function() {
        EditorState.set(this.editor, "[0]x   x   ");
        this.cursorTools.skipNonWordCharactersForward();
        return expect(EditorState.get(this.editor)).toEqual("[0]x   x   ");
      });
      return it("moves to the end of the buffer if all following characters are nonword characters", function() {
        EditorState.set(this.editor, "[0]   ");
        this.cursorTools.skipNonWordCharactersForward();
        return expect(EditorState.get(this.editor)).toEqual("   [0]");
      });
    });
    describe("skipBackwardUntil", function() {
      it("moves backward over the given characters", function() {
        EditorState.set(this.editor, "x..x..[0]");
        this.cursorTools.skipBackwardUntil(/[^\.]/);
        return expect(EditorState.get(this.editor)).toEqual("x..x[0]..");
      });
      it("does not move if the previous character is not in the list", function() {
        EditorState.set(this.editor, "..x[0]");
        this.cursorTools.skipBackwardUntil(/[^\.]/);
        return expect(EditorState.get(this.editor)).toEqual("..x[0]");
      });
      return it("moves to the beginning of the buffer if all prior characters are in the list", function() {
        EditorState.set(this.editor, "..[0]");
        this.cursorTools.skipBackwardUntil(/[^\.]/);
        return expect(EditorState.get(this.editor)).toEqual("[0]..");
      });
    });
    describe("skipForwardUntil", function() {
      it("moves forward over the given characters", function() {
        EditorState.set(this.editor, "[0]..x..x");
        this.cursorTools.skipForwardUntil(/[^\.]/);
        return expect(EditorState.get(this.editor)).toEqual("..[0]x..x");
      });
      it("does not move if the next character is not in the list", function() {
        EditorState.set(this.editor, "[0]x..");
        this.cursorTools.skipForwardUntil(/[^\.]/);
        return expect(EditorState.get(this.editor)).toEqual("[0]x..");
      });
      return it("moves to the end of the buffer if all following characters are in the list", function() {
        EditorState.set(this.editor, "[0]..");
        this.cursorTools.skipForwardUntil(/[^\.]/);
        return expect(EditorState.get(this.editor)).toEqual("..[0]");
      });
    });
    describe("nextCharacter", function() {
      it("returns the line separator if at the end of a line", function() {
        EditorState.set(this.editor, "ab[0]\ncd");
        return expect(this.cursorTools.nextCharacter()).toEqual('\n');
      });
      it("return null if at the end of the buffer", function() {
        EditorState.set(this.editor, "ab[0]");
        return expect(this.cursorTools.nextCharacter()).toBe(null);
      });
      return it("returns the character to the right of the cursor otherwise", function() {
        EditorState.set(this.editor, "a[0]b\ncd");
        return expect(this.cursorTools.nextCharacter()).toEqual('b');
      });
    });
    describe("previousCharacter", function() {
      it("returns the line separator if at the end of a line", function() {
        EditorState.set(this.editor, "ab[0]\ncd");
        return expect(this.cursorTools.nextCharacter()).toEqual('\n');
      });
      it("return null if at the end of the buffer", function() {
        EditorState.set(this.editor, "ab[0]");
        return expect(this.cursorTools.nextCharacter()).toBe(null);
      });
      return it("returns the character to the right of the cursor otherwise", function() {
        EditorState.set(this.editor, "a[0]b\ncd");
        return expect(this.cursorTools.nextCharacter()).toEqual('b');
      });
    });
    describe("skipSexpForward", function() {
      it("skips over the current symbol when inside one", function() {
        EditorState.set(this.editor, "a[0]bc de");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("abc[0] de");
      });
      it("includes all symbol characters in the symbol", function() {
        EditorState.set(this.editor, "a[0]b_1c de");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("ab_1c[0] de");
      });
      it("moves over any non-sexp chars before the symbol", function() {
        EditorState.set(this.editor, "[0] .-! ab");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual(" .-! ab[0]");
      });
      it("moves to the end of the buffer if there is nothing after the symbol", function() {
        EditorState.set(this.editor, "a[0]bc");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("abc[0]");
      });
      it("skips over balanced parentheses if before an open parenthesis", function() {
        EditorState.set(this.editor, "a[0](b)c");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("a(b)[0]c");
      });
      it("moves over any non-sexp chars before the opening parenthesis", function() {
        EditorState.set(this.editor, "[0] .-! (x)");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual(" .-! (x)[0]");
      });
      it("is not tricked by nested parentheses", function() {
        EditorState.set(this.editor, "a[0]((b c)(\n))d");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("a((b c)(\n))[0]d");
      });
      it("is not tricked by backslash-escaped parentheses", function() {
        EditorState.set(this.editor, "a[0](b\\)c)d");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("a(b\\)c)[0]d");
      });
      it("is not tricked by unmatched parentheses", function() {
        EditorState.set(this.editor, "a[0](b]c)d");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("a(b]c)[0]d");
      });
      it("skips over balanced quotes (assuming it starts outside the quotes)", function() {
        EditorState.set(this.editor, 'a[0]"b c"d');
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual('a"b c"[0]d');
      });
      it("moves over any non-sexp chars before the opening quote", function() {
        EditorState.set(this.editor, "[0] .-! 'x'");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual(" .-! 'x'[0]");
      });
      it("is not tricked by nested quotes of another type", function() {
        EditorState.set(this.editor, "a[0]'b\"c'd");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("a'b\"c'[0]d");
      });
      it("does not move if it can't find a matching parenthesis", function() {
        EditorState.set(this.editor, "a[0](b");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("a[0](b");
      });
      it("does not move if at the end of the buffer", function() {
        EditorState.set(this.editor, "a[0]");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("a[0]");
      });
      return it("does not move if before a closing parenthesis", function() {
        EditorState.set(this.editor, "(a [0]) b");
        this.cursorTools.skipSexpForward();
        return expect(EditorState.get(this.editor)).toEqual("(a [0]) b");
      });
    });
    describe("skipSexpBackward", function() {
      it("skips over the current symbol when inside one", function() {
        EditorState.set(this.editor, "ab cd[0]e");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("ab [0]cde");
      });
      it("includes all symbol characters in the symbol", function() {
        EditorState.set(this.editor, "ab c_1d[0]e");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("ab [0]c_1de");
      });
      it("moves over any non-sexp chars after the symbol", function() {
        EditorState.set(this.editor, "ab .-! [0]");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("[0]ab .-! ");
      });
      it("moves to the beginning of the buffer if there is nothing before the symbol", function() {
        EditorState.set(this.editor, "ab[0]c");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("[0]abc");
      });
      it("skips over balanced parentheses if before an open parenthesis", function() {
        EditorState.set(this.editor, "a(b)[0]c");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("a[0](b)c");
      });
      it("moves over any non-sexp chars after the closing parenthesis", function() {
        EditorState.set(this.editor, "(x) .-! [0]");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("[0](x) .-! ");
      });
      it("is not tricked by nested parentheses", function() {
        EditorState.set(this.editor, "a((b c)(\n))[0]d");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("a[0]((b c)(\n))d");
      });
      it("is not tricked by backslash-escaped parentheses", function() {
        EditorState.set(this.editor, "a(b\\)c)[0]d");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("a[0](b\\)c)d");
      });
      it("is not tricked by unmatched parentheses", function() {
        EditorState.set(this.editor, "a(b[c)[0]d");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("a[0](b[c)d");
      });
      it("skips over balanced quotes (assuming it starts outside the quotes)", function() {
        EditorState.set(this.editor, 'a"b c"[0]d');
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual('a[0]"b c"d');
      });
      it("moves over any non-sexp chars after the closing quote", function() {
        EditorState.set(this.editor, "'x' .-! [0]");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("[0]'x' .-! ");
      });
      it("is not tricked by nested quotes of another type", function() {
        EditorState.set(this.editor, "a'b\"c'[0]d");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("a[0]'b\"c'd");
      });
      it("does not move if it can't find a matching parenthesis", function() {
        EditorState.set(this.editor, "a)[0]b");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("a)[0]b");
      });
      it("does not move if at the beginning of the buffer", function() {
        EditorState.set(this.editor, "[0]a");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("[0]a");
      });
      return it("does not move if after an opening parenthesis", function() {
        EditorState.set(this.editor, "a ([0] b)");
        this.cursorTools.skipSexpBackward();
        return expect(EditorState.get(this.editor)).toEqual("a ([0] b)");
      });
    });
    describe("markSexp", function() {
      it("selects the next sexp if the selection is not active", function() {
        EditorState.set(this.editor, "a[0] (b c) d");
        this.cursorTools.markSexp();
        return expect(EditorState.get(this.editor)).toEqual("a[0] (b c)(0) d");
      });
      it("extends the selection over the next sexp if the selection is active", function() {
        EditorState.set(this.editor, "a[0] (b c)(0) (d e) f");
        this.cursorTools.markSexp();
        return expect(EditorState.get(this.editor)).toEqual("a[0] (b c) (d e)(0) f");
      });
      it("extends to the end of the buffer if there is no following sexp", function() {
        EditorState.set(this.editor, "a[0] (b c)(0) ");
        this.cursorTools.markSexp();
        return expect(EditorState.get(this.editor)).toEqual("a[0] (b c) (0)");
      });
      return it("does nothing if the selection is extended to the end of the buffer", function() {
        EditorState.set(this.editor, "a[0] (b c)(0)");
        this.cursorTools.markSexp();
        return expect(EditorState.get(this.editor)).toEqual("a[0] (b c)(0)");
      });
    });
    return describe("extractWord", function() {
      it("removes and returns the word the cursor is in", function() {
        var word;
        EditorState.set(this.editor, "aa bb[0]cc dd");
        word = this.cursorTools.extractWord();
        expect(word).toEqual("bbcc");
        return expect(EditorState.get(this.editor)).toEqual("aa [0] dd");
      });
      it("removes and returns the word the cursor is at the start of", function() {
        var word;
        EditorState.set(this.editor, "aa [0]bb cc");
        word = this.cursorTools.extractWord();
        expect(word).toEqual("bb");
        return expect(EditorState.get(this.editor)).toEqual("aa [0] cc");
      });
      it("removes and returns the word the cursor is at the end of", function() {
        var word;
        EditorState.set(this.editor, "aa bb[0] cc");
        word = this.cursorTools.extractWord();
        expect(word).toEqual("bb");
        return expect(EditorState.get(this.editor)).toEqual("aa [0] cc");
      });
      it("returns an empty string and removes nothing if the cursor is not in a word", function() {
        var word;
        EditorState.set(this.editor, "aa [0] bb");
        word = this.cursorTools.extractWord();
        expect(word).toEqual("");
        return expect(EditorState.get(this.editor)).toEqual("aa [0] bb");
      });
      it("returns an empty string and removes nothing if not in a word at the start of the buffer", function() {
        var word;
        EditorState.set(this.editor, "[0] aa");
        word = this.cursorTools.extractWord();
        expect(word).toEqual("");
        return expect(EditorState.get(this.editor)).toEqual("[0] aa");
      });
      it("returns an empty string and removes nothing if not in a word at the end of the buffer", function() {
        var word;
        EditorState.set(this.editor, "aa [0]");
        word = this.cursorTools.extractWord();
        expect(word).toEqual("");
        return expect(EditorState.get(this.editor)).toEqual("aa [0]");
      });
      return it("returns and removes the only word in a buffer if inside it", function() {
        var word;
        EditorState.set(this.editor, "a[0]b");
        word = this.cursorTools.extractWord();
        expect(word).toEqual("ab");
        return expect(EditorState.get(this.editor)).toEqual("[0]");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3Mvc3BlYy9jdXJzb3ItdG9vbHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsU0FBQyxLQUFELEdBQUE7QUFDakIsSUFBQSxJQUFHLEtBQUg7YUFDRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBYixFQUFrQixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQTlCLEVBQXNDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBaEQsRUFBcUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUEvRCxFQURGO0tBQUEsTUFBQTthQUdFLE1BSEY7S0FEaUI7RUFBQSxDQUhuQixDQUFBOztBQUFBLEVBU0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsTUFBRCxHQUFBO0FBQ3ZCLFlBQUEsS0FBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7bUJBQ0EsS0FBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFaLEVBRkk7VUFBQSxDQUEzQixFQURjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIs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

//# sourceURL=/home/iraasta/.atom/packages/atomic-emacs/spec/cursor-tools-spec.coffee
