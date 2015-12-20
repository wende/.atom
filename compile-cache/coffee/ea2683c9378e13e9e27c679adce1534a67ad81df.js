(function() {
  var IS_ELIXIR, RsenseClient, RsenseProvider, lang;

  IS_ELIXIR = true;

  lang = IS_ELIXIR ? "elixir" : "erlang";

  RsenseClient = require("./autocomplete-" + lang + "-client.coffee");

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.selector = ".source." + lang;

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
    }

    RsenseProvider.prototype.getSuggestions = function(request) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, npref, postfix, prefix, row, _ref;
          row = request.bufferPosition.row;
          col = request.bufferPosition.column;
          prefix = request.editor.getTextInBufferRange([[row, 0], [row, col]]);
          _ref = prefix.split(/[ ()]/), prefix = _ref[_ref.length - 1];
          if (!prefix) {
            resolve([]);
          }
          npref = /.*\./.exec(prefix);
          postfix = "";
          if (npref) {
            postfix = prefix.replace(npref[0], "");
            prefix = npref[0];
          }
          return completions = _this.rsenseClient.checkCompletion(prefix, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(prefix, postfix, completions);
            if (!(suggestions != null ? suggestions.length : void 0)) {
              return resolve();
            }
            return resolve(suggestions);
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, postfix, completions) {
      var argTypes, args, completion, count, func, i, inserted, isModule, label, last, one, ret, spec, specs, suggestion, suggestions, type, types, word, _, _i, _len, _ref, _ref1, _ref2, _ref3;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!((completion.name !== prefix + postfix) && (completion.name.indexOf(postfix) === 0))) {
            continue;
          }
          one = completion.continuation;
          _ref = completion.name.trim().split("@"), word = _ref[0], spec = _ref[1];
          argTypes = null;
          ret = null;
          if (!word || !word[0]) {
            continue;
          }
          if (word[0] === word[0].toUpperCase()) {
            _ref1 = ["Module", true], ret = _ref1[0], isModule = _ref1[1];
          }
          label = completion.spec;
          if (spec) {
            specs = spec.replace(/^[\w!?]+/, "");
            types = specs.substring(1, specs.length - 1).split(",");
            label = specs;
            _ref2 = specs.match(/\(?(.+)\)\s*::\s*(.*)/), _ = _ref2[0], args = _ref2[1], ret = _ref2[2];
            argTypes = args.split(",");
          }
          count = parseInt(/\d+$/.exec(word)) || 0;
          func = /\d+$/.test(word);
          if (func) {
            word = word.split("/")[0] + "(";
          }
          inserted = word;
          i = 0;
          while (++i <= count) {
            if (argTypes) {
              word += ("${" + i + ":" + "}") + (i !== count ? "," : "");
            } else {
              word += ("${" + i + ":" + i + "}") + (i !== count ? "," : "");
            }
            inserted += ("${" + i + ":" + i + "}") + (i !== count ? "," : "");
          }
          if (func) {
            word += ")${" + (count + 1) + ":\u0020}";
            inserted += ")${" + (count + 1) + ":\u0020}";
          }
          _ref3 = (prefix + postfix).split(IS_ELIXIR ? "." : ":"), last = _ref3[_ref3.length - 1];
          type = "variable";
          if (isModule) {
            type = "method";
          }
          if (func) {
            type = "function";
          }
          suggestion = {
            snippet: one ? prefix + postfix + word : word,
            displayText: one ? prefix + postfix + word : word,
            replacementPrefix: one ? prefix + postfix : last,
            rightLabel: ret ? ret : "any",
            type: type,
            description: spec || ret || "Desc"
          };
          suggestions.push(suggestion);
        }
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.dispose = function() {};

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFFO0FBQUEsTUFBQSw2Q0FBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQVUsU0FBSCxHQUFrQixRQUFsQixHQUFnQyxRQUZ2QyxDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUyxpQkFBQSxHQUFpQixJQUFqQixHQUFzQixnQkFBL0IsQ0FKZixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDZCQUFBLFFBQUEsR0FBVyxVQUFBLEdBQVUsSUFBckIsQ0FBQTs7QUFBQSw2QkFDQSxZQUFBLEdBQWMsSUFEZCxDQUFBOztBQUdhLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxZQUFBLENBQUEsQ0FBcEIsQ0FEVztJQUFBLENBSGI7O0FBQUEsNkJBTUEsY0FBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTtBQUNkLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ2pCLGNBQUEsbURBQUE7QUFBQSxVQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQTdCLENBQUE7QUFBQSxVQUNBLEdBQUEsR0FBTSxPQUFPLENBQUMsY0FBYyxDQUFDLE1BRDdCLENBQUE7QUFBQSxVQUdBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFmLENBQW9DLENBQUMsQ0FBQyxHQUFELEVBQU0sQ0FBTixDQUFELEVBQVUsQ0FBQyxHQUFELEVBQU0sR0FBTixD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

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-provider.coffee
