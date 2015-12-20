(function() {
  var Message, MessageElement, MultilineElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MultilineElement = require('./multiline');

  Message = (function(_super) {
    __extends(Message, _super);

    function Message() {
      return Message.__super__.constructor.apply(this, arguments);
    }

    Message.prototype.initialize = function(message, options) {
      this.message = message;
      this.options = options;
    };

    Message.prototype.attachedCallback = function() {
      this.appendChild(Message.renderRibbon(this.message));
      this.appendChild(Message.renderMessage(this.message, this.options));
      if (this.message.filePath) {
        return this.appendChild(Message.renderLink(this.message, this.options));
      }
    };

    Message.renderLink = function(message, _arg) {
      var addPath, displayFile, el;
      addPath = _arg.addPath;
      displayFile = message.filePath;
      atom.project.getPaths().forEach(function(path) {
        if (message.filePath.indexOf(path) !== 0 || displayFile !== message.filePath) {
          return;
        }
        return displayFile = message.filePath.substr(path.length + 1);
      });
      el = document.createElement('a');
      el.addEventListener('click', function() {
        return Message.onClick(message.filePath, message.range);
      });
      if (message.range) {
        el.textContent = "at line " + (message.range.start.row + 1) + " col " + (message.range.start.column + 1) + " ";
      }
      if (addPath) {
        el.textContent += "in " + displayFile;
      }
      return el;
    };

    Message.renderRibbon = function(message) {
      var el;
      el = document.createElement('span');
      el.classList.add('badge');
      el.classList.add('badge-flexible');
      el.classList.add("linter-highlight");
      el.classList.add(message["class"]);
      el.textContent = message.type;
      return el;
    };

    Message.renderMessage = function(message, _arg) {
      var cloneNode, el;
      cloneNode = _arg.cloneNode;
      el = document.createElement('span');
      if (message.html) {
        if (typeof message.html === 'string') {
          el.innerHTML = message.html;
        } else {
          if (cloneNode) {
            el.appendChild(message.html.cloneNode(true));
          } else {
            el.appendChild(message.html);
          }
        }
      } else if (message.multiline) {
        el.appendChild(MultilineElement.fromText(message.text));
      } else {
        el.textContent = message.text;
      }
      return el;
    };

    Message.onClick = function(file, range) {
      return atom.workspace.open(file).then(function() {
        if (!range) {
          return;
        }
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(range.start);
      });
    };

    Message.fromMessage = function(message, options) {
      var MessageLine;
      if (options == null) {
        options = {};
      }
      MessageLine = new MessageElement();
      MessageLine.initialize(message, options);
      return MessageLine;
    };

    return Message;

  })(HTMLElement);

  module.exports = MessageElement = document.registerElement('linter-message', {
    prototype: Message.prototype
  });

  module.exports.fromMessage = Message.fromMessage;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsYUFBUixDQUFuQixDQUFBOztBQUFBLEVBRU07QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsVUFBQSxHQUFZLFNBQUUsT0FBRixFQUFZLE9BQVosR0FBQTtBQUFzQixNQUFyQixJQUFDLENBQUEsVUFBQSxPQUFvQixDQUFBO0FBQUEsTUFBWCxJQUFDLENBQUEsVUFBQSxPQUFVLENBQXRCO0lBQUEsQ0FBWixDQUFBOztBQUFBLHNCQUVBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsSUFBQyxDQUFBLE9BQXRCLENBQWIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxDQUFhLE9BQU8sQ0FBQyxhQUFSLENBQXNCLElBQUMsQ0FBQSxPQUF2QixFQUFnQyxJQUFDLENBQUEsT0FBakMsQ0FBYixDQURBLENBQUE7QUFFQSxNQUFBLElBQXVELElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBaEU7ZUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLE9BQU8sQ0FBQyxVQUFSLENBQW1CLElBQUMsQ0FBQSxPQUFwQixFQUE2QixJQUFDLENBQUEsT0FBOUIsQ0FBYixFQUFBO09BSGdCO0lBQUEsQ0FGbEIsQ0FBQTs7QUFBQSxJQU9BLE9BQUMsQ0FBQSxVQUFELEdBQWEsU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO0FBQ1gsVUFBQSx3QkFBQTtBQUFBLE1BRHNCLFVBQUQsS0FBQyxPQUN0QixDQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWMsT0FBTyxDQUFDLFFBQXRCLENBQUE7QUFBQSxNQUNBLElBQUks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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/views/message.coffee