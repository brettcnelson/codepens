var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var data = function () {
  var b = new Array(3).fill(1).map(function (x) {
    return new Array(3).fill(' ');
  });
  var wins = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]], [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], [[0, 0], [1, 1], [2, 2]], [[2, 0], [1, 1], [0, 2]]];
  var stats = { X: 0, O: 0, ties: 0 };
  var symms = [[[[0, 2], [1, 2], [2, 2]], [[0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [2, 0]]], [[[2, 2], [2, 1], [2, 0]], [[1, 2], [1, 1], [1, 0]], [[0, 2], [0, 1], [0, 0]]], [[[2, 0], [1, 0], [0, 0]], [[2, 1], [1, 1], [0, 1]], [[2, 2], [1, 2], [0, 2]]], [[[0, 2], [0, 1], [0, 0]], [[1, 2], [1, 1], [1, 0]], [[2, 2], [2, 1], [2, 0]]], [[[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]]], [[[2, 0], [2, 1], [2, 2]], [[1, 0], [1, 1], [1, 2]], [[0, 0], [0, 1], [0, 2]]], [[[2, 2], [1, 2], [0, 2]], [[2, 1], [1, 1], [0, 1]], [[2, 0], [1, 0], [0, 0]]]];
  var id = 1;
  var games = [];

  function Game(n) {
    this.number = n;
    this.moves = [];
  }

  // Game.prototype.show = function(i) {
  //   console.log(i+1,'============',this.number,[this.leafID,this.res,this.moves.length])
  //   this.moves.forEach(function(m,i) {
  //     console.log(i+1,m.letter,(m.wins-m.losses)/m.total,[m.wins,m.losses,m.ties,m.total])
  //     m.board.forEach(r=>console.log(r))
  //   })
  // }

  function Move(board, p) {
    this.parent = p || null;
    this.board = board || b;
    this.letter = !p || this.parent.letter === 'X' ? 'O' : 'X';
    this.wins = 0;
    this.losses = 0;
    this.ties = 0;
    this.total = 0;
    this.children = [];
  }

  Move.prototype.gameOver = function () {
    var _this = this;

    return wins.some(function (w) {
      return w.every(function (p) {
        return _this.board[p[0]][p[1]] === _this.letter;
      });
    });
  };

  Move.prototype.update = function (res) {
    var node = this;
    if (res === 't') {
      stats.ties++;
      while (node) {
        node.ties++;
        node.total++;
        node = node.parent;
      }
    } else {
      stats[this.letter]++;
      while (node) {
        node.letter === this.letter ? node.wins++ : node.losses++;
        node.total++;
        node = node.parent;
      }
    }
  };

  Move.prototype.makeTree = function () {
    if (this.gameOver()) {
      this.update('w');
    } else {
      this.board.forEach(function (r, i) {
        r.forEach(function (c, j) {
          if (c === ' ') {
            var nextMove = new Move(this.board.map(function (x) {
              return x.slice();
            }), this);
            nextMove.board[i][j] = nextMove.letter;
            nextMove.pos = i * 3 + (j + 1);
            this.symmCheck(nextMove.board) && this.children.push(nextMove);
            // this.children.push(nextMove);
          }
        }.bind(this));
      }.bind(this));
      this.children.length ? this.children.forEach(function (c) {
        return c.makeTree();
      }) : this.update('t');
    }
  };

  Move.prototype.symmCheck = function (b) {
    return this.children.every(function (c) {
      return !symms.some(function (sym) {
        return c.board.every(function (r, i) {
          return r.every(function (s, j) {
            return s === b[sym[i][j][0]][sym[i][j][1]];
          });
        });
      });
    });
  };

  Move.prototype.countNodes = function () {
    var nodes = 0;
    var nodesPlayed = 0;
    var leaves = 0;
    var leavesPlayed = 0;
    c.call(this);
    return { nodes: nodes, nodesPlayed: nodesPlayed, leaves: leaves, leavesPlayed: leavesPlayed };
    function c() {
      nodes++;
      this.played && nodesPlayed++;
      if (!this.children.length) {
        leaves++;
        this.played && leavesPlayed++;
      } else {
        this.children.forEach(function (ch) {
          return c.call(ch);
        });
      }
    }
  };

  function pick(a, b) {
    return p(b) > p(a) ? b : a;
    function p(n) {
      // return (n.wins - n.losses - (n.ties/2))/n.total
      return (n.wins - n.losses) / n.total;
    }
  }

  Move.prototype.go = function () {
    if (this.children.length) {
      var move = this.children.reduce(pick);
      move.played = true;
      move.go();
    } else {
      !this.leafID && (this.leafID = id++);
      if (this.gameOver()) {
        this.update('w');
      } else {
        this.update('t');
      }
    }
  };

  Move.prototype.play = function () {
    return this.children.reduce(pick);
  };

  var tree = new Move();
  tree.makeTree();
  var orig = Object.assign({}, stats);
  for (var i = 0; i < 16889; i++) {
    tree.go();
  }
  console.log({ X: stats.X - orig.X, O: stats.O - orig.O, ties: stats.ties - orig.ties });
  console.log(tree.countNodes());

  return {
    tree: tree
  };
}();

var Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this2 = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this2.state = {
      board: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      curr: data.tree,
      thinking: true,
      player: false
    };
    return _this2;
  }

  _createClass(Application, [{
    key: 'compMove',
    value: function compMove() {
      var currMove = this.state.curr;
      this.setState({ curr: currMove.play(), player: true });
    }
  }, {
    key: 'squareClick',
    value: function squareClick(p) {
      var newCurr = this.state.curr.children.filter(function (x) {
        return x.pos === p;
      })[0];
      this.setState({ curr: newCurr, player: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.state.player) {
        setTimeout(function () {
          return _this3.compMove();
        }, 1000);
      }
      return React.createElement(
        'div',
        { id: 'main' },
        React.createElement(
          'div',
          { className: 'board' },
          this.state.board.map(function (r, i) {
            return React.createElement(
              'div',
              null,
              r.map(function (s, j) {
                return _this3.state.curr.children.some(function (c) {
                  return c.pos === s;
                }) ? React.createElement('div', { className: 'pos', onClick: function onClick() {
                    return _this3.squareClick(i * 3 + (j + 1));
                  } }) : React.createElement(
                  'div',
                  { className: 'square' },
                  _this3.state.curr.board[i][j]
                );
              })
            );
          })
        )
      );
    }
  }]);

  return Application;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById("app"));