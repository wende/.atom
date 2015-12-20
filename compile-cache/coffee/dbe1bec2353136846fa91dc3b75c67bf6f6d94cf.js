(function() {
  var assert;

  assert = require('assert');

  describe('Top level describe', function() {
    describe('Nested describe', function() {
      it('is successful', function() {
        return assert(true);
      });
      return it('fails', function() {
        return assert(false);
      });
    });
    return describe('Other nested', function() {
      it('is also successful', function() {
        return assert(true);
      });
      return it('is successful\t\nwith\' []()"&%', function() {
        return assert(true);
      });
    });
  });

}).call(this);
