(function() {
  var Range, SnippetsProvider, fuzzaldrin;

  Range = require('atom').Range;

  fuzzaldrin = require('fuzzaldrin');

  module.exports = SnippetsProvider = (function() {
    function SnippetsProvider() {}

    SnippetsProvider.prototype.selector = '*';

    SnippetsProvider.prototype.getSuggestions = function(_arg) {
      var prefix, scopeDescriptor, scopeSnippets;
      scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      if (!(prefix != null ? prefix.length : void 0)) {
        return;
      }
      scopeSnippets = atom.config.get('snippets', {
        scope: scopeDescriptor
      });
      return this.findSuggestionsForPrefix(scopeSnippets, prefix);
    };

    SnippetsProvider.prototype.findSuggestionsForPrefix = function(snippets, prefix) {
      var snippet, __, _results;
      if (snippets == null) {
        return [];
      }
      _results = [];
      for (__ in snippets) {
        snippet = snippets[__];
        if (snippet.prefix.lastIndexOf(prefix, 0) !== -1) {
          _results.push({
            text: snippet.prefix,
            replacementPrefix: prefix,
            rightLabel: snippet.name
          });
        }
      }
      return _results;
    };

    SnippetsProvider.prototype.onDidInsertSuggestion = function(_arg) {
      var editor;
      editor = _arg.editor;
      return atom.commands.dispatch(atom.views.getView(editor), 'snippets:expand');
    };

    return SnippetsProvider;

  })();

}).call(this);
