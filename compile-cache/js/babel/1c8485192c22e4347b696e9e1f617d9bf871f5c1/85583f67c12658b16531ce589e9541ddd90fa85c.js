'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var BottomTab = (function (_HTMLElement) {
  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(BottomTab, _HTMLElement);

  _createClass(BottomTab, [{
    key: 'prepare',
    value: function prepare(name) {
      this.name = name;
      this.attached = false;
      this.active = false;
      this.classList.add('linter-tab');
      this.countSpan = document.createElement('span');
      this.countSpan.classList.add('count');
      this.countSpan.textContent = '0';
      this.innerHTML = this.name + ' ';
      this.appendChild(this.countSpan);
      return this;
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.attached = true;
    }
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      this.attached = false;
    }
  }, {
    key: 'active',
    get: function get() {
      return this._active;
    },
    set: function set(value) {
      this._active = value;
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
    }
  }, {
    key: 'count',
    set: function set(value) {
      this.countSpan.textContent = value;
    }
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tdGFiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztJQUVQLFNBQVM7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztZQUFULFNBQVM7O2VBQVQsU0FBUzs7V0FDTixpQkFBQyxJQUFJLEVBQUM7QUFDWCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtBQUNyQixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3JDLFVBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQTtBQUNoQyxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2hDLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUNlLDRCQUFHO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQ3JCOzs7V0FDZSw0QkFBRTtBQUNoQixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtLQUN0Qjs7O1NBQ1MsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjtTQUNTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDN0IsTUFBTTtBQUNMLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7OztTQUNRLGFBQUMsS0FBSyxFQUFFO0FBQ2YsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO0tBQ25DOzs7U0FoQ0csU0FBUztHQUFTLFdBQVc7O0FBbUNuQyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFO0FBQ3pFLFdBQVMsRUFBRSxTQUFTLENBQUMsU0FBUztDQUMvQixDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS10YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEJvdHRvbVRhYiBleHRlbmRzIEhUTUxFbGVtZW50e1xuICBwcmVwYXJlKG5hbWUpe1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLmF0dGFjaGVkID0gZmFsc2VcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdsaW50ZXItdGFiJylcbiAgICB0aGlzLmNvdW50U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuY291bnRTcGFuLmNsYXNzTGlzdC5hZGQoJ2NvdW50JylcbiAgICB0aGlzLmNvdW50U3Bhbi50ZXh0Q29udGVudCA9ICcwJ1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdGhpcy5uYW1lICsgJyAnXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvdW50U3BhbilcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5hdHRhY2hlZCA9IHRydWVcbiAgfVxuICBkZXRhY2hlZENhbGxiYWNrKCl7XG4gICAgdGhpcy5hdHRhY2hlZCA9IGZhbHNlXG4gIH1cbiAgZ2V0IGFjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlXG4gIH1cbiAgc2V0IGFjdGl2ZSh2YWx1ZSkge1xuICAgIHRoaXMuX2FjdGl2ZSA9IHZhbHVlXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG4gIH1cbiAgc2V0IGNvdW50KHZhbHVlKSB7XG4gICAgdGhpcy5jb3VudFNwYW4udGV4dENvbnRlbnQgPSB2YWx1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm90dG9tVGFiID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItYm90dG9tLXRhYicsIHtcbiAgcHJvdG90eXBlOiBCb3R0b21UYWIucHJvdG90eXBlXG59KVxuIl19