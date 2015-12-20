(function() {
  var RsenseProvider;

  RsenseProvider = require('./autocomplete-elixir-provider.coffee');

  module.exports = {
    config: {
      elixrPath: {
        type: 'string',
        "default": "elixir",
        description: "Absolute path to elixir executable (essential for MacOS)"
      }
    },
    rsenseProvider: null,
    activate: function(state) {
      return this.rsenseProvider = new RsenseProvider();
    },
    provideAutocompletion: function() {
      return [this.rsenseProvider];
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.rsenseProvider) != null) {
        _ref.dispose();
      }
      return this.rsenseProvider = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx1Q0FBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsUUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDBEQUZiO09BREY7S0FERjtBQUFBLElBTUEsY0FBQSxFQUFnQixJQU5oQjtBQUFBLElBUUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQUEsRUFEZDtJQUFBLENBUlY7QUFBQSxJQVdBLHFCQUFBLEVBQXVCLFNBQUEsR0FBQTthQUNyQixDQUFDLElBQUMsQ0FBQSxjQUFGLEVBRHFCO0lBQUEsQ0FYdkI7QUFBQSxJQWNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQWUsQ0FBRSxPQUFqQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUZSO0lBQUEsQ0FkWjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir.coffee