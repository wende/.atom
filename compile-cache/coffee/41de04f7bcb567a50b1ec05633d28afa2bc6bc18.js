(function() {
  describe('Message Element', function() {
    var Message, filePath, getMessage, visibleText;
    Message = require('../../lib/ui/message-element').Message;
    filePath = __dirname + '/fixtures/file.txt';
    getMessage = function(type) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath
      };
    };
    visibleText = function(element) {
      var cloned;
      cloned = element.cloneNode(true);
      Array.prototype.forEach.call(cloned.querySelectorAll('[hidden]'), function(item) {
        return item.remove();
      });
      return cloned.textContent;
    };
    it('works', function() {
      var message, messageElement;
      message = getMessage('Error');
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(visibleText(messageElement).indexOf(filePath) !== -1).toBe(true);
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentLine = true;
      messageElement.updateVisibility('Line');
      return expect(visibleText(messageElement).indexOf(filePath) === -1).toBe(true);
    });
    return it('plays nice with class attribute', function() {
      var message, messageElement;
      message = getMessage('Error');
      message["class"] = 'Well Hello';
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(messageElement.querySelector('.Well') instanceof Element).toBe(true);
      expect(messageElement.querySelector('.Hello') instanceof Element).toBe(true);
      return expect(messageElement.querySelector('.haha')).toBe(null);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy91aS9tZXNzYWdlLWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLDBDQUFBO0FBQUEsSUFBQyxVQUFXLE9BQUEsQ0FBUSw4QkFBUixFQUFYLE9BQUQsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLFNBQUEsR0FBWSxvQkFEdkIsQ0FBQTtBQUFBLElBR0EsVUFBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsYUFBTztBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxJQUFBLEVBQU0sY0FBYjtBQUFBLFFBQTZCLFVBQUEsUUFBN0I7T0FBUCxDQURXO0lBQUEsQ0FIYixDQUFBO0FBQUEsSUFLQSxXQUFBLEdBQWMsU0FBQyxPQUFELEdBQUE7QUFDWixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsU0FBUixDQUFrQixJQUFsQixDQUFULENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQXhCLENBQTZCLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixVQUF4QixDQUE3QixFQUFrRSxTQUFDLElBQUQsR0FBQTtlQUNoRSxJQUFJLENBQUMsTUFBTCxDQUFBLEVBRGdFO01BQUEsQ0FBbEUsQ0FEQSxDQUFBO0FBSUEsYUFBTyxNQUFNLENBQUMsV0FBZCxDQUxZO0lBQUEsQ0FMZCxDQUFBO0FBQUEsSUFZQSxFQUFBLENBQUcsT0FBSCxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsdUJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxVQUFBLENBQVcsT0FBWCxDQUFWLENBQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBcEIsRUFBNkIsU0FBN0IsQ0FEakIsQ0FBQTtBQUFBLE1BRUEsY0FBYyxDQUFDLGdCQUFmLENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFJQSxNQUFBLENBQU8sV0FBQSxDQUFZLGNBQVosQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxRQUFwQyxDQUFBLEtBQW1ELENBQUEsQ0FBMUQsQ0FBNkQsQ0FBQyxJQUE5RCxDQUFtRSxJQUFuRSxDQUpBLENBQUE7QUFBQSxNQU1BLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQU5BLENBQUE7QUFBQSxNQU9BLE1BQUEsQ0FBTyxjQUFjLENBQUMsWUFBZixDQUE0QixRQUE1QixDQUFQLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsSUFBbkQsQ0FQQSxDQUFBO0FBQUEsTUFRQSxPQUFPLENBQUMsV0FBUixHQUFzQixJQVJ0QixDQUFBO0FBQUEsTUFTQSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FUQSxDQUFBO2FBVUEsTUFBQSxDQUFPLFdBQUEsQ0FBWSxjQUFaLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsUUFBcEMsQ0FBQSxLQUFpRCxDQUFBLENBQXhELENBQTJELENBQUMsSUFBNUQsQ0FBaUUsSUFBakUsRUFYVTtJQUFBLENBQVosQ0FaQSxDQUFBO1dBeUJBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsVUFBQSx1QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFVBQUEsQ0FBVyxPQUFYLENBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLE9BQUQsQ0FBUCxHQUFnQixZQURoQixDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLEVBQTZCLFNBQTdCLENBRmpCLENBQUE7QUFBQSxNQUdBLGNBQWMsQ0FBQyxnQkFBZixDQUFBLENBSEEsQ0FBQTtBQUFBLE1BS0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxhQUFmLENBQTZCLE9BQTdCLENBQUEsWUFBaUQsT0FBeEQsQ0FBZ0UsQ0FBQyxJQUFqRSxDQUFzRSxJQUF0RSxDQUxBLENBQUE7QUFBQSxNQU1BLE1BQUEsQ0FBTyxjQUFjLENBQUMsYUFBZixDQUE2QixRQUE3QixDQUFBLFlBQWtELE9BQXpELENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsSUFBdkUsQ0FOQSxDQUFBO2FBT0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxhQUFmLENBQTZCLE9BQTdCLENBQVAsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxJQUFuRCxFQVJvQztJQUFBLENBQXRDLEVBMUIwQjtFQUFBLENBQTVCLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/iraasta/.atom/packages/linter/spec/ui/message-element-spec.coffee
