(function() {
  var RsenseProvider;

  RsenseProvider = require('./autocomplete-erlang-provider.coffee');

  module.exports = {
    config: {
      port: {
        description: 'The port the rsense server is running on',
        type: 'integer',
        "default": 47367,
        minimum: 1024,
        maximum: 65535
      }
    },
    rsenseProvider: null,
    activate: function(state) {
      return this.rsenseProvider = new RsenseProvider();
    },
    provideAutocompletion: function() {
      return {
        providers: [this.rsenseProvider]
      };
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx1Q0FBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwwQ0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsUUFHQSxPQUFBLEVBQVMsSUFIVDtBQUFBLFFBSUEsT0FBQSxFQUFTLEtBSlQ7T0FERjtLQURGO0FBQUEsSUFRQSxjQUFBLEVBQWdCLElBUmhCO0FBQUEsSUFVQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLGNBQUEsQ0FBQSxFQURkO0lBQUEsQ0FWVjtBQUFBLElBYUEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO2FBQ3JCO0FBQUEsUUFBQyxTQUFBLEVBQVcsQ0FBQyxJQUFDLENBQUEsY0FBRixDQUFaO1FBRHFCO0lBQUEsQ0FidkI7QUFBQSxJQWdCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOztZQUFlLENBQUUsT0FBakIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsS0FGUjtJQUFBLENBaEJaO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang.coffee