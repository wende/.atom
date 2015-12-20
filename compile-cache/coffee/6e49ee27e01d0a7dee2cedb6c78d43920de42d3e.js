(function() {
  module.exports = {
    config: {
      elixircExecutablePath: {
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
      return console.log('activate linter-elixirc');
    }
  };

}).call(this);
