var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var data = function () {
  function Node(n, d) {
    this.val = n;
    this.d = d;
    this.right = this.left = null;
  }

  var metaData = { 1: 0, count: 0 };

  Node.prototype.add = function (n, d) {
    d = d || 1;
    var diff = 2;
    if (!this.val) {
      this.val = n;
      this.d = d;
      metaData[d]++;
      metaData.head = this;
      return false;
    } else if (n < this.val) {
      if (this.left) {
        return this.left.add(n, d + 1);
      } else if (d < diff || metaData[d - (diff - 1)] === Math.pow(2, d - diff)) {
        this.left = new Node(n, ++d);
        metaData[d] ? metaData[d]++ : metaData[d] = 1;
        return false;
      } else {
        // console.log(metaData)
        // metaData.head.rebalance(n)
        this.left = new Node(n, ++d);
        return true;
      }
    } else if (this.right) {
      return this.right.add(n, d + 1);
    } else if (d < diff || metaData[d - (diff - 1)] === Math.pow(2, d - diff)) {
      this.right = new Node(n, ++d);
      metaData[d] ? metaData[d]++ : metaData[d] = 1;
      return false;
    } else {
      // console.log(metaData)
      // metaData.head.rebalance(n)
      this.right = new Node(n, ++d);
      return true;
    }
  };

  Node.prototype.rebalance = function () {
    var _this = this;

    metaData = { 1: 0, count: metaData.count + 1 };
    var nodes = this.getNodes();
    console.log('countNodes', nodes.length);
    this.val = this.left = this.right = null;
    nodes.forEach(function (node) {
      return _this.add(node);
    });
  };

  Node.prototype.getNodes = function () {
    var nodes = [];
    getAll.call(this);
    return logSort(nodes.sort(function (a, b) {
      return a - b;
    }));
    function getAll() {
      nodes.push(this.val);
      this.left && getAll.call(this.left);
      this.right && getAll.call(this.right);
    }
    function logSort(a) {
      var res = [];
      var q = [a];
      while (q.length) {
        var node = q.shift();
        if (node.length < 2) {
          res.push.apply(res, _toConsumableArray(node));
        } else {
          res.push(node.splice(node.length / 2, 1)[0]);
          if (node.length > 1) {
            q.push(node.splice(0, Math.ceil(node.length / 2)));
          }
          q.push(node.splice(0));
        }
      }
      return res;
    }
  };

  var a = new Array(65535).fill(0).map(function (x, i) {
    return i + 1;
  });
  a.forEach(function (v, i) {
    a.push(a.splice(Math.random() * (a.length - i), 1)[0]);
  });

  function rebalance() {
    metaData.head.rebalance();
  }

  function resume() {
    while (a.length && !tree.add(a.shift())) {
      // console.log('=====',a.length)
    }
    if (!a.length) {
      // rebalance()
      return true;
    }
  }

  var tree = new Node();
  metaData.head = tree;
  // resume()

  return {
    tree: tree,
    rebalance: rebalance,
    resume: resume
  };
}();

var Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this2 = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this2.state = {
      curr: data.tree,
      history: [],
      forward: [],
      head: data.tree
    };
    return _this2;
  }

  _createClass(Application, [{
    key: "renderTree",
    value: function renderTree(n) {
      var _this3 = this;

      if (n) {
        return React.createElement(
          "div",
          { className: "node" },
          React.createElement(
            "div",
            { className: "val", onClick: function onClick() {
                return _this3.selectTree(n);
              } },
            n.val
          ),
          React.createElement(
            "div",
            { className: "child left" },
            this.renderTree(n.left)
          ),
          React.createElement(
            "div",
            { className: "child right" },
            this.renderTree(n.right)
          )
        );
      }
    }
  }, {
    key: "selectTree",
    value: function selectTree(n) {
      var h = this.state.history.slice();
      h.push(this.state.curr);
      this.setState({ curr: n, history: h, forward: [] });
    }
  }, {
    key: "rebalance",
    value: function rebalance() {
      data.rebalance();
      this.setState({});
    }
  }, {
    key: "resume",
    value: function resume() {
      data.resume();
      this.setState({});
    }
  }, {
    key: "auto",
    value: function auto() {
      var delay = 100;
      data.rebalance();
      this.setState({});
      setTimeout(this.res.bind(this), delay);
    }
  }, {
    key: "res",
    value: function res() {
      var _this4 = this;

      var delay = 100;
      if (!data.resume()) {
        setTimeout(this.auto.bind(this), delay);
        this.setState({});
      } else {
        this.setState({});
        setTimeout(data.rebalance, delay);
        setTimeout(function () {
          return _this4.setState({});
        }, delay);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this5.rebalance();
            } },
          "REBALANCE"
        ),
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this5.resume();
            } },
          "RESUME"
        ),
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this5.auto();
            } },
          "AUTO"
        ),
        React.createElement(
          "div",
          { id: "main" },
          this.renderTree(this.state.curr)
        )
      );
    }
  }]);

  return Application;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById("app"));