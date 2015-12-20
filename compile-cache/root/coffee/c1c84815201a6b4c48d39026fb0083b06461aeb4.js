(function() {
  var Helpers, Range;

  Range = require('atom').Range;

  Helpers = module.exports = {
    validateResults: function(results) {
      var result, _i, _len;
      if ((!results) || results.constructor.name !== 'Array') {
        throw new Error("Got invalid response from Linter, Type: " + (typeof results));
      }
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        if (!result.type) {
          throw new Error("Missing type field on Linter Response, Got: " + (Object.keys(result)));
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result["class"] = result.type.toLowerCase().replace(' ', '-');
        if (result.trace) {
          Helpers.validateResults(result.trace);
        }
      }
      return results;
    },
    validateLinter: function(linter) {
      var message;
      if (!(linter.grammarScopes instanceof Array)) {
        message = "grammarScopes is not an Array. (see console for more info)";
        console.warn(message);
        console.warn('grammarScopes', linter.grammarScopes);
        throw new Error(message);
      }
      if (linter.lint == null) {
        throw new Error("Missing linter.lint");
      }
      if (typeof linter.lint !== 'function') {
        throw new Error("linter.lint isn't a function");
      }
      return true;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFQLEdBQ1I7QUFBQSxJQUFBLGVBQUEsRUFBaUIsU0FBQyxPQUFELEdBQUE7QUFDZixVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFHLENBQUMsQ0FBQSxPQUFELENBQUEsSUFBaUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFwQixLQUE4QixPQUFsRDtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU8sMENBQUEsR0FBeUMsQ0FBQyxNQUFBLENBQUEsT0FBRCxDQUFoRCxDQUFWLENBREY7T0FBQTtBQUVBLFdBQUEsOENBQUE7NkJBQUE7QUFDRSxRQUFBLElBQUEsQ0FBQSxNQUFhLENBQUMsSUFBZDtBQUNFLGdCQUFVLElBQUEsS0FBQSxDQUFPLDhDQUFBLEdBQTZDLENBQUMsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLENBQUQsQ0FBcEQsQ0FBVixDQURGO1NBQUE7QUFFQSxRQUFBLElBQWdELG9CQUFoRDtBQUFBLFVBQUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxLQUFLLENBQUMsVUFBTixDQUFpQixNQUFNLENBQUMsS0FBeEIsQ0FBZixDQUFBO1NBRkE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxPQUFELENBQU4sR0FBZSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVosQ0FBQSxDQUF5QixDQUFDLE9BQTFCLENBQWtDLEdBQWxDLEVBQXVDLEdBQXZDLENBSGYsQ0FBQTtBQUlBLFFBQUEsSUFBeUMsTUFBTSxDQUFDLEtBQWhEO0FBQUEsVUFBQSxPQUFPLENBQUMsZUFBUixDQUF3QixNQUFNLENBQUMsS0FBL0IsQ0FBQSxDQUFBO1NBTEY7QUFBQSxPQUZBO2FBUUEsUUFUZTtJQUFBLENBQWpCO0FBQUEsSUFVQSxjQUFBLEVBQWdCLFNBQUMsTUFBRCxHQUFBO0FBQ2QsVUFBQSxPQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxZQUFnQyxLQUF2QyxDQUFBO0FBQ0UsUUFBQSxPQUFBLEdBQVUsNERBQVYsQ0FBQTtBQUFBLFFBQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFiLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLEVBQThCLE1BQU0sQ0FBQyxhQUFyQyxDQUZBLENBQUE7QUFHQSxjQUFVLElBQUEsS0FBQSxDQUFNLE9BQU4sQ0FBVixDQUpGO09BQUE7QUFNQSxNQUFBLElBQU8sbUJBQVA7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFNLHFCQUFOLENBQVYsQ0FERjtPQU5BO0FBU0EsTUFBQSxJQUFHLE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixVQUEzQjtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU0sOEJBQU4sQ0FBVixDQURGO09BVEE7QUFZQSxhQUFPLElBQVAsQ0FiYztJQUFBLENBVmhCO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/helpers.coffee