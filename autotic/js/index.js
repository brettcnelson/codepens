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
            nextMove.pos = [i, j];
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
      games[games.length - 1].moves.push(Object.assign({}, move));
      move.go();
    } else {
      !this.leafID && (this.leafID = id++);
      games[games.length - 1].leafID = this.leafID;
      if (this.gameOver()) {
        games[games.length - 1].res = this.letter;
        this.update('w');
      } else {
        games[games.length - 1].res = 'tie';
        this.update('t');
      }
    }
  };

  var tree = new Move();
  tree.makeTree();

  var orig = Object.assign({}, stats);

  for (var i = 0; i < 17000; i++) {
    games.push(new Game(i + 1));
    games[games.length - 1].moves.push(tree);
    tree.go();
  }
  console.log({ X: stats.X - orig.X, O: stats.O - orig.O, ties: stats.ties - orig.ties });
  console.log(tree.countNodes());

  return {
    tree: tree,
    games: games.filter(function (x) {
      return x.res === 'X' || x.res === 'O';
    })
  };
}();

var Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this2 = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this2.state = {
      tree: data.tree,
      games: data.games,
      game: 0,
      move: 0
    };
    return _this2;
  }

  _createClass(Application, [{
    key: 'load',
    value: function load() {
      var _this3 = this;

      setTimeout(function () {
        return _this3.moving();
      }, 1000);
    }
  }, {
    key: 'moving',
    value: function moving() {
      if (this.state.games[this.state.game].moves[this.state.move].children.length) {
        var oldmove = this.state.move;
        this.setState({ move: oldmove + 1 });
      } else if (this.state.game < this.state.games.length - 1) {
        var oldgame = this.state.game;
        this.setState({ game: oldgame + 1, move: 0 });
      }
    }
  }, {
    key: 'renderBoard',
    value: function renderBoard() {
      var three = new Array(3).fill(1);
      return React.createElement(
        'div',
        { className: 'board' },
        three.map(renderRow.bind(this))
      );
      function renderRow(r, i) {
        return React.createElement(
          'div',
          { className: 'rows' },
          three.map(renderSquare.bind(this))
        );
        function renderSquare(s, j) {
          return React.createElement(
            'div',
            { className: 'square', pos: [i, j] },
            this.state.games[this.state.game].moves[this.state.move].board[i][j]
          );
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.load();
      var currGame = this.state.games[this.state.game];
      var currMove = currGame.moves[this.state.move];
      return React.createElement(
        'div',
        { id: 'main' },
        React.createElement(
          'div',
          { className: 'stats' },
          React.createElement(
            'div',
            null,
            'Game No.: ',
            currGame.number
          ),
          React.createElement(
            'div',
            null,
            'leafID: ',
            currGame.leafID,
            ' - res: ',
            currGame.res,
            ' - Moves: ',
            currGame.moves.length
          )
        ),
        React.createElement(
          'div',
          null,
          'Playing: ',
          currMove.letter,
          ' - ratio: ',
          (currMove.wins - currMove.losses) / currMove.total
        ),
        React.createElement(
          'div',
          null,
          this.renderBoard()
        )
      );
    }
  }]);

  return Application;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById("app"));