var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var data = function () {
  function Node(str) {
    this.val = str;
    this.right = this.left = null;
  }

  Node.prototype.add = function (str) {
    !this.val ? this.val = str : str < this.val ? this.left ? this.left.add(str) : this.left = new Node(str) : this.right ? this.right.add(str) : this.right = new Node(str);
  };

  var alpha = 'abcdefghijklmnopqrstuvwxyz';
  var names = ['george', 'john', 'geoffrey', 'alan', 'alda', 'alfred', 'andrew', 'bill', 'barbara', 'caroline', 'christine', 'dave', 'jessica', ''];
  var tree = new Node();
  // for (var i = 0 ; i < 1000 ; i++) {
  while (names.length) {
    tree.add(names.splice(Math.random() * names.length, 1)[0]);
  }
  // }

  return {
    tree: tree
  };
}();

var Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this.state = {
      curr: data.tree
    };
    return _this;
  }

  _createClass(Application, [{
    key: 'renderTree',
    value: function renderTree(n) {
      if (n) {
        return React.createElement(
          'div',
          { className: 'node' },
          React.createElement(
            'div',
            { className: 'val' },
            n.val
          ),
          React.createElement(
            'div',
            { className: 'child left' },
            this.renderTree(n.left)
          ),
          React.createElement(
            'div',
            { className: 'child right' },
            this.renderTree(n.right)
          )
        );
      }
    }
  }, {
    key: 'find',
    value: function find(node) {
      var search = prompt('enter letters');
      var q = [node];
      while (q.length) {
        BFSrec.call(q.shift());
      }
      function inOrder() {
        this.left && inOrder.call(this.left);
        if (this.val.split('').slice(0, search.length).join('') === search) {
          console.log(this.val);
        }
        this.right && inOrder.call(this.right);
      }
      function BFSrec() {
        if (this.val.split('').slice(0, search.length).join('') === search) {
          q = [];
          inOrder.call(this);
        } else {
          this.left && q.push(this.left);
          this.right && q.push(this.right);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'button',
          { onClick: function onClick() {
              return _this2.find(_this2.state.curr);
            } },
          'FIND'
        ),
        React.createElement(
          'div',
          { id: 'main' },
          this.renderTree(this.state.curr)
        )
      );
    }
  }]);

  return Application;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById("app"));