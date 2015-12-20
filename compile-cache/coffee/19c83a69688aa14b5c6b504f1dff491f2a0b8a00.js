(function() {
  describe('AutocompleteSnippets', function() {
    var activateSnippetsPackage, autocompleteMain, autocompleteManager, completionDelay, editor, editorView, snippetsMain, _ref;
    _ref = [], completionDelay = _ref[0], editor = _ref[1], editorView = _ref[2], snippetsMain = _ref[3], autocompleteMain = _ref[4], autocompleteManager = _ref[5];
    beforeEach(function() {
      runs(function() {
        var workspaceElement;
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        autocompleteMain = atom.packages.loadPackage('autocomplete-plus').mainModule;
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        snippetsMain = atom.packages.loadPackage('autocomplete-snippets').mainModule;
        return spyOn(snippetsMain, 'provide').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.workspace.open('sample.js').then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return Promise.all([atom.packages.activatePackage('language-javascript'), atom.packages.activatePackage('autocomplete-plus'), atom.packages.activatePackage('autocomplete-snippets')]);
      });
      waitsFor(function() {
        var _ref1;
        return ((_ref1 = autocompleteMain.autocompleteManager) != null ? _ref1.ready : void 0) && snippetsMain.provide.calls.length === 1 && autocompleteMain.consumeProvider.calls.length === 1;
      });
      return runs(function() {
        autocompleteManager = autocompleteMain.autocompleteManager;
        spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
        return spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
      });
    });
    activateSnippetsPackage = function() {
      var module;
      module = null;
      runs(function() {
        return module = null;
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('snippets').then(function(_arg) {
          var mainModule;
          mainModule = _arg.mainModule;
          module = mainModule;
          return module.loaded = false;
        });
      });
      return waitsFor('all snippets to load', 3000, function() {
        return module.loaded;
      });
    };
    return describe('when autocomplete-plus is enabled', function() {
      it('shows autocompletions when there are snippets available', function() {
        activateSnippetsPackage();
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('d');
          editor.insertText('o');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView.querySelector('.autocomplete-plus span.word')).toHaveText('do');
          return expect(editorView.querySelector('.autocomplete-plus span.completion-label')).toHaveText('do');
        });
      });
      return it("expands the snippet on confirm", function() {
        activateSnippetsPackage();
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('d');
          editor.insertText('o');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).toExist();
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return expect(editor.getText()).toContain('} while (true);');
        });
      });
    });
  });

}).call(this);
