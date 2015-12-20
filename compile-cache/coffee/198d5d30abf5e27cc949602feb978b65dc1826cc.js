(function() {
  var RsenseProvider;

  RsenseProvider = require('./autocomplete-erlang-provider.coffee');

  require("./static.min.js");

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx1Q0FBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsT0FBQSxDQUFRLGlCQUFSLENBREEsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsMENBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLFFBR0EsT0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLE9BQUEsRUFBUyxLQUpUO09BREY7S0FERjtBQUFBLElBUUEsY0FBQSxFQUFnQixJQVJoQjtBQUFBLElBVUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQUEsRUFEZDtJQUFBLENBVlY7QUFBQSxJQWFBLHFCQUFBLEVBQXVCLFNBQUEsR0FBQTthQUNyQjtBQUFBLFFBQUMsU0FBQSxFQUFXLENBQUMsSUFBQyxDQUFBLGNBQUYsQ0FBWjtRQURxQjtJQUFBLENBYnZCO0FBQUEsSUFnQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTs7WUFBZSxDQUFFLE9BQWpCLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEtBRlI7SUFBQSxDQWhCWjtHQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang.coffee