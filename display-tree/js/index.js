var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var data = function () {
  function Tree(v) {
    this.val = v || null;
    this.left = null;
    this.right = null;
  };
  Tree.prototype.add = function (v) {
    if (!this.val) {
      this.val = v;
    } else if (this.val === v) {
      return;
    } else {
      v < this.val ? this.left ? this.left.add(v) : this.left = new Tree(v) : this.right ? this.right.add(v) : this.right = new Tree(v);
    }
  };

  var tree = new Tree();
  var nums = [];
  for (var i = 0; i < 127; i++) {
    nums.push(i + 1);
  }
  while (nums.length) {
    tree.add(nums.splice(Math.random() * nums.length, 1)[0]);
  }

  function balance(a) {
    var res = [];
    ins(a);
    return res.map(function (x) {
      return x[0];
    });
    function ins(a) {
      if (a.length < 2) {
        return a;
      }
      res.push(a.slice(a.length / 2, a.length / 2 + 1));
      res.push(ins(a.slice(0, a.length / 2)));
      res.push(ins(a.slice(a.length / 2 + 1)));
      res = res.filter(function (x) {
        return x.length;
      });
    }
  }
  // balance(nums).forEach(x=>tree.add(x))

  function addNode(v) {
    tree.add(v);
  }

  return {
    tree: tree,
    addNode: addNode
  };
}();

// function Node(props) {
//   function branch(left,right) {
//     if (props.n.left) {left = <div className='left'>/</div>}
//     if (props.n.right) {right = <div className='right'>\</div>}
//     // return <div>{left}{right}</div>
//     // <div className='branch'>{branch()}</div>
//   }
//   function children(n,s) {
//     // return !n ? <div className='null'></div> : s ? <Node n={props.n.left} /> : <Node n={props.n.right} />
//     if (n) {return s ? <Node n={n} clickPass={props.clickPass} onClick={() => props.clickPass(props.n.left)} /> : <Node n={n} clickPass={props.clickPass} onClick={() => props.clickPass(props.n.right)} />}
//   }
//   return (
//     <div className='node'>
//       <div className='val' onClick={props.onClick}>{props.n.val}</div>
//       <div className='child left'>{children(props.n.left,true)}</div><div className='child right'>{children(props.n.right)}</div>
//     </div>
//   )
// }

var Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this.state = {
      curr: data.tree,
      history: [],
      forward: [],
      head: data.tree
    };
    return _this;
  }

  _createClass(Application, [{
    key: "renderTree",
    value: function renderTree(n) {
      var _this2 = this;

      if (n) {
        return React.createElement(
          "div",
          { className: "node" },
          React.createElement(
            "div",
            { className: "val", onClick: function onClick() {
                return _this2.selectTree(n);
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
    key: "back",
    value: function back() {
      var h = this.state.history.slice();
      if (h.length) {
        var f = this.state.forward.slice();
        var b = h.pop();
        f.push(this.state.curr);
        this.setState({ curr: b, history: h, forward: f });
      }
    }
  }, {
    key: "forward",
    value: function forward() {
      var f = this.state.forward.slice();
      if (f.length) {
        var h = this.state.history.slice();
        h.push(this.state.curr);
        var next = f.pop();
        this.setState({ curr: next, history: h, forward: f });
      }
    }
  }, {
    key: "head",
    value: function head() {
      if (this.state.curr !== data.tree) {
        var h = this.state.history.slice();
        h.push(this.state.curr);
        this.setState({ curr: data.tree, history: h, forward: [] });
      }
    }
  }, {
    key: "addNode",
    value: function addNode() {
      var v = Number(prompt('val?'));
      data.addNode(v);
      this.setState({});
    }
    // <Node n={this.state.curr} onClick={() => this.selectTree(this.state.curr)} clickPass={this.selectTree.bind(this)} />

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this3.head();
            } },
          "HEAD"
        ),
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this3.back();
            } },
          "BACK"
        ),
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this3.forward();
            } },
          "FORWARD"
        ),
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this3.addNode();
            } },
          "ADD"
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