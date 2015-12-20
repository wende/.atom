(function() {
  module.exports = {
    config: {
      erlcExecutablePath: {
        type: 'string',
        "default": ''
      },
      includeDirs: {
        type: 'string',
        "default": ''
      },
      pa: {
        type: 'string',
        "default": ''
      }
    },
    activate: function() {
      return console.log('activate linter-erlc');
    }
  };

}).call(this);
