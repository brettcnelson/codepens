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

    for (var i = 0; i < wins.length; i++) {
      if (wins[i].every(function (p) {
        return _this.board[p[0]][p[1]] === _this.letter;
      })) {
        this.winning = wins[i].map(function (x) {
          return x[0] * 3 + (x[1] + 1);
        });
        return true;
      }
    }
  };

  Move.prototype.update = function (res) {
    this.res = res === 'w' ? this.letter + ' wins!' : 'TIE!';
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
      this.gameOver() ? this.update('w') : this.update('t');
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

function Square(props) {
  return React.createElement(
    'div',
    { className: props.classes || 'square', onClick: props.sClick },
    props.val
  );
}

function Board(props) {
  var board = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  function squareClick(p) {
    return props.sClick(p);
  }
  function makeSquares() {
    return board.map(function (r, i) {
      return React.createElement(
        'div',
        null,
        r.map(function (s, j) {
          return props.curr.winning ? props.curr.winning.some(function (w) {
            return w === i * 3 + (j + 1);
          }) ? React.createElement(Square, { classes: 'square winning', val: props.curr.board[i][j] }) : React.createElement(Square, { val: props.curr.board[i][j] }) : !props.curr.children.some(function (c) {
            return c.pos === board[i][j];
          }) ? React.createElement(Square, { val: props.curr.board[i][j] }) : React.createElement(Square, { classes: 'square pos', sClick: function sClick() {
              return squareClick(board[i][j]);
            }, val: props.curr.board[i][j] });
        })
      );
    });
  }
  return React.createElement(
    'div',
    { className: 'board' },
    makeSquares()
  );
}

var Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this2 = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this2.state = {
      curr: data.tree,
      player: true,
      res: false,
      first: true
    };
    return _this2;
  }

  _createClass(Application, [{
    key: 'compMove',
    value: function compMove() {
      this.changeState(this.state.curr.play(), true);
    }
  }, {
    key: 'squareClick',
    value: function squareClick(p) {
      this.changeState(this.state.curr.children.filter(function (x) {
        return x.pos === p;
      })[0], false);
    }
  }, {
    key: 'changeState',
    value: function changeState(move, b) {
      var r = move.children.length ? false : true;
      this.setState({ curr: move, player: b, res: r });
    }
  }, {
    key: 'auto',
    value: function auto() {
      this.setState({ curr: data.tree, player: false, res: false, first: false });
    }
  }, {
    key: 'human',
    value: function human() {
      this.setState({ curr: data.tree, player: true, res: false, first: true });
    }
  }, {
    key: 'renderButtons',
    value: function renderButtons() {
      var _this3 = this;

      return this.state.first ? React.createElement(
        'button',
        { onClick: function onClick() {
            return _this3.auto();
          } },
        'let the computer go first'
      ) : React.createElement(
        'button',
        { onClick: function onClick() {
            return _this3.human();
          } },
        'let the human go first'
      );
    }
  }, {
    key: 'again',
    value: function again() {
      var player = this.state.first;
      this.setState({ curr: data.tree, player: player, res: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (!this.state.player && this.state.curr.children.length) {
        setTimeout(function () {
          return _this4.compMove();
        }, 1000);
      }
      return React.createElement(
        'div',
        { id: 'main' },
        React.createElement(
          'div',
          { id: 'buttons' },
          this.renderButtons(),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this4.again();
              } },
            'play again'
          )
        ),
        React.createElement(
          'div',
          { id: 'banner' },
          this.state.res ? this.state.curr.res : this.state.player ? 'your move' : 'COMP'
        ),
        React.createElement(Board, { curr: this.state.curr, sClick: function sClick(p) {
            return _this4.squareClick(p);
          } })
      );
    }
  }]);

  return Application;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById("app"));