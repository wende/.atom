(function() {
  var RsenseProvider;

  RsenseProvider = require('./autocomplete-erlang-provider.coffee');

  module.exports = {
    config: {
      elixirPath: {
        type: 'string',
        "default": "",
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx1Q0FBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDBEQUZiO09BREY7S0FERjtBQUFBLElBT0EsY0FBQSxFQUFnQixJQVBoQjtBQUFBLElBU0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQUEsRUFEZDtJQUFBLENBVFY7QUFBQSxJQVlBLHFCQUFBLEVBQXVCLFNBQUEsR0FBQTthQUNyQixDQUFDLElBQUMsQ0FBQSxjQUFGLEVBRHFCO0lBQUEsQ0FadkI7QUFBQSxJQWVBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQWUsQ0FBRSxPQUFqQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUZSO0lBQUEsQ0FmWjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang-2.0/lib/autocomplete-erlang.coffee