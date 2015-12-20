(function() {
  var Range, SnippetsProvider, ascendingPrefixComparator, firstCharsEqual;

  Range = require('atom').Range;

  module.exports = SnippetsProvider = (function() {
    SnippetsProvider.prototype.selector = '*';

    SnippetsProvider.prototype.disableForSelector = '.comment, .string';

    SnippetsProvider.prototype.inclusionPriority = 1;

    SnippetsProvider.prototype.suggestionPriority = 2;

    SnippetsProvider.prototype.filterSuggestions = true;

    function SnippetsProvider() {
      this.showIcon = atom.config.get('autocomplete-plus.defaultProvider') === 'Symbol';
    }

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
      var snippet, snippetPrefix, suggestions;
      if (snippets == null) {
        return [];
      }
      suggestions = [];
      for (snippetPrefix in snippets) {
        snippet = snippets[snippetPrefix];
        if (!(snippet && snippetPrefix && prefix && firstCharsEqual(snippetPrefix, prefix))) {
          continue;
        }
        suggestions.push({
          iconHTML: this.showIcon ? void 0 : false,
          type: 'snippet',
          text: snippet.prefix,
          replacementPrefix: prefix,
          rightLabel: snippet.name,
          description: snippet.description,
          descriptionMoreURL: snippet.descriptionMoreURL
        });
      }
      suggestions.sort(ascendingPrefixComparator);
      return suggestions;
    };

    SnippetsProvider.prototype.onDidInsertSuggestion = function(_arg) {
      var editor;
      editor = _arg.editor;
      return atom.commands.dispatch(atom.views.getView(editor), 'snippets:expand');
    };

    return SnippetsProvider;

  })();

  ascendingPrefixComparator = function(a, b) {
    return a.prefix - b.prefix;
  };

  firstCharsEqual = function(str1, str2) {
    return str1[0].toLowerCase() === str2[0].toLowerCase();
  };

}).call(this);
