(function() {
  module.exports = {
    provider: null,
    activate: function() {},
    deactivate: function() {
      return this.provider = null;
    },
    provide: function() {
      var SnippetsProvider;
      if (this.provider == null) {
        SnippetsProvider = require('./snippets-provider');
        this.provider = new SnippetsProvider();
      }
      return this.provider;
    }
  };

}).call(this);
