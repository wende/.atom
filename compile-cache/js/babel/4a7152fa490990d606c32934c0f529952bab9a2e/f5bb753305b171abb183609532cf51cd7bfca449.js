var assert = require("assert");
var pty = require("../");
var mocha = require("mocha");

var tests = [{
  name: "should be correctly setup",
  command: ["children/void.js"],
  options: { cwd: __dirname },
  test: function test() {
    assert.equal(this.file, process.execPath);
  }
}, {
  name: "should support stdin",
  command: ["children/stdin.js"],
  options: { cwd: __dirname },
  test: function test() {
    this.write("☃");
  }
}, {
  name: "should support resize",
  command: ["children/resize.js"],
  options: { cwd: __dirname },
  test: function test() {
    this.resize(100, 100);
  }
}, {
  name: "should change uid/gid",
  command: ["children/uidgid.js"],
  options: { cwd: __dirname, uid: 777, gid: 777 },
  test: function test() {}
}];

describe("Pty", function () {
  tests.forEach(function (testCase) {
    if (testCase.options.uid && testCase.options.gid && (process.platform == "win32" || process.getgid() !== 0)) {
      // Skip tests that contains user impersonation if we are not able to do so.
      return it.skip(testCase.name);
    }
    it(testCase.name, function (done) {
      var term = pty.fork(process.execPath, testCase.command, testCase.options);
      term.pipe(process.stderr);

      // any output is considered failure. this is only a workaround
      // until the actual error code is passed through
      var count = 0;
      term.on("data", function (data) {
        count++;
      });
      term.on("exit", function () {
        // XXX Temporary until we find out why this gets emitted twice:
        if (done.done) return;
        done.done = true;

        assert.equal(count, 0);
        done();
      });

      // Wait for pty to be ready
      setTimeout(testCase.test.bind(term), 1000);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWVybGFuZy9saWIvc2VydmVyL3B0eS5qcy90ZXN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLEtBQUssR0FBRyxDQUNWO0FBQ0UsTUFBSSxFQUFFLDJCQUEyQjtBQUNqQyxTQUFPLEVBQUUsQ0FBRSxrQkFBa0IsQ0FBRTtBQUMvQixTQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQzNCLE1BQUksRUFBRSxnQkFBWTtBQUNoQixVQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzNDO0NBQ0YsRUFBRTtBQUNELE1BQUksRUFBRSxzQkFBc0I7QUFDNUIsU0FBTyxFQUFFLENBQUUsbUJBQW1CLENBQUU7QUFDaEMsU0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRTtBQUMzQixNQUFJLEVBQUUsZ0JBQVk7QUFDaEIsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNqQjtDQUNGLEVBQUU7QUFDRCxNQUFJLEVBQUUsdUJBQXVCO0FBQzdCLFNBQU8sRUFBRSxDQUFFLG9CQUFvQixDQUFFO0FBQ2pDLFNBQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUU7QUFDM0IsTUFBSSxFQUFFLGdCQUFZO0FBQ2hCLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZCO0NBQ0YsRUFBRTtBQUNELE1BQUksRUFBRSx1QkFBdUI7QUFDN0IsU0FBTyxFQUFFLENBQUUsb0JBQW9CLENBQUU7QUFDakMsU0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDL0MsTUFBSSxFQUFFLGdCQUFZLEVBQUU7Q0FDckIsQ0FDRixDQUFDOztBQUVGLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBVztBQUN6QixPQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsUUFBUSxFQUFFO0FBQ2hDLFFBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQSxBQUFDLEVBQUU7O0FBRTNHLGFBQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDL0I7QUFDRCxNQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLElBQUksRUFBRTtBQUNoQyxVQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUUsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7QUFJMUIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsVUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFJLEVBQUU7QUFDOUIsYUFBSyxFQUFFLENBQUM7T0FDVCxDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFZOztBQUUxQixZQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTztBQUN0QixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsY0FBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkIsWUFBSSxFQUFFLENBQUM7T0FDUixDQUFDLENBQUM7OztBQUdILGdCQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUMsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWVybGFuZy9saWIvc2VydmVyL3B0eS5qcy90ZXN0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xudmFyIHB0eSA9IHJlcXVpcmUoJy4uLycpO1xudmFyIG1vY2hhID0gcmVxdWlyZSgnbW9jaGEnKTtcblxudmFyIHRlc3RzID0gW1xuICB7XG4gICAgbmFtZTogJ3Nob3VsZCBiZSBjb3JyZWN0bHkgc2V0dXAnLFxuICAgIGNvbW1hbmQ6IFsgJ2NoaWxkcmVuL3ZvaWQuanMnIF0sXG4gICAgb3B0aW9uczogeyBjd2Q6IF9fZGlybmFtZSB9LFxuICAgIHRlc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5lcXVhbCh0aGlzLmZpbGUsIHByb2Nlc3MuZXhlY1BhdGgpO1xuICAgIH1cbiAgfSwge1xuICAgIG5hbWU6ICdzaG91bGQgc3VwcG9ydCBzdGRpbicsXG4gICAgY29tbWFuZDogWyAnY2hpbGRyZW4vc3RkaW4uanMnIF0sXG4gICAgb3B0aW9uczogeyBjd2Q6IF9fZGlybmFtZSB9LFxuICAgIHRlc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMud3JpdGUoJ+KYgycpO1xuICAgIH1cbiAgfSwge1xuICAgIG5hbWU6ICdzaG91bGQgc3VwcG9ydCByZXNpemUnLFxuICAgIGNvbW1hbmQ6IFsgJ2NoaWxkcmVuL3Jlc2l6ZS5qcycgXSxcbiAgICBvcHRpb25zOiB7IGN3ZDogX19kaXJuYW1lIH0sXG4gICAgdGVzdDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5yZXNpemUoMTAwLCAxMDApO1xuICAgIH1cbiAgfSwge1xuICAgIG5hbWU6ICdzaG91bGQgY2hhbmdlIHVpZC9naWQnLFxuICAgIGNvbW1hbmQ6IFsgJ2NoaWxkcmVuL3VpZGdpZC5qcycgXSxcbiAgICBvcHRpb25zOiB7IGN3ZDogX19kaXJuYW1lLCB1aWQ6IDc3NywgZ2lkOiA3NzcgfSxcbiAgICB0ZXN0OiBmdW5jdGlvbiAoKSB7fVxuICB9XG5dO1xuXG5kZXNjcmliZSgnUHR5JywgZnVuY3Rpb24oKSB7XG4gIHRlc3RzLmZvckVhY2goZnVuY3Rpb24gKHRlc3RDYXNlKSB7XG4gICAgaWYgKHRlc3RDYXNlLm9wdGlvbnMudWlkICYmIHRlc3RDYXNlLm9wdGlvbnMuZ2lkICYmIChwcm9jZXNzLnBsYXRmb3JtID09ICd3aW4zMicgfHwgcHJvY2Vzcy5nZXRnaWQoKSAhPT0gMCkpIHtcbiAgICAgIC8vIFNraXAgdGVzdHMgdGhhdCBjb250YWlucyB1c2VyIGltcGVyc29uYXRpb24gaWYgd2UgYXJlIG5vdCBhYmxlIHRvIGRvIHNvLlxuICAgICAgcmV0dXJuIGl0LnNraXAodGVzdENhc2UubmFtZSk7XG4gICAgfVxuICAgIGl0KHRlc3RDYXNlLm5hbWUsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICB2YXIgdGVybSA9IHB0eS5mb3JrKHByb2Nlc3MuZXhlY1BhdGgsIHRlc3RDYXNlLmNvbW1hbmQsIHRlc3RDYXNlLm9wdGlvbnMpO1xuICAgICAgdGVybS5waXBlKHByb2Nlc3Muc3RkZXJyKTtcblxuICAgICAgLy8gYW55IG91dHB1dCBpcyBjb25zaWRlcmVkIGZhaWx1cmUuIHRoaXMgaXMgb25seSBhIHdvcmthcm91bmRcbiAgICAgIC8vIHVudGlsIHRoZSBhY3R1YWwgZXJyb3IgY29kZSBpcyBwYXNzZWQgdGhyb3VnaFxuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIHRlcm0ub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgfSk7XG4gICAgICB0ZXJtLm9uKCdleGl0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBYWFggVGVtcG9yYXJ5IHVudGlsIHdlIGZpbmQgb3V0IHdoeSB0aGlzIGdldHMgZW1pdHRlZCB0d2ljZTpcbiAgICAgICAgaWYgKGRvbmUuZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbChjb3VudCwgMCk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXYWl0IGZvciBwdHkgdG8gYmUgcmVhZHlcbiAgICAgIHNldFRpbWVvdXQodGVzdENhc2UudGVzdC5iaW5kKHRlcm0pLCAxMDAwKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==