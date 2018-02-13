var data = (function() {
  var b = new Array(3).fill(1).map(x=>new Array(3).fill(' '));
  var wins = [[[0,0],[0,1],[0,2]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],[[0,0],[1,1],[2,2]],[[2,0],[1,1],[0,2]]];
  var stats = {X:0,O:0,ties:0};
  var symms = [
    [[[0,2],[1,2],[2,2]],[[0,1],[1,1],[2,1]],[[0,0],[1,0],[2,0]]],
    [[[2,2],[2,1],[2,0]],[[1,2],[1,1],[1,0]],[[0,2],[0,1],[0,0]]],
    [[[2,0],[1,0],[0,0]],[[2,1],[1,1],[0,1]],[[2,2],[1,2],[0,2]]],
    [[[0,2],[0,1],[0,0]],[[1,2],[1,1],[1,0]],[[2,2],[2,1],[2,0]]],
    [[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]]],
    [[[2,0],[2,1],[2,2]],[[1,0],[1,1],[1,2]],[[0,0],[0,1],[0,2]]],
    [[[2,2],[1,2],[0,2]],[[2,1],[1,1],[0,1]],[[2,0],[1,0],[0,0]]]
  ]
  var id = 1
  var games = []

  function Game(n) {
    this.number = n
    this.moves = []
  }

  // Game.prototype.show = function(i) {
  //   console.log(i+1,'============',this.number,[this.leafID,this.res,this.moves.length])
  //   this.moves.forEach(function(m,i) {
  //     console.log(i+1,m.letter,(m.wins-m.losses)/m.total,[m.wins,m.losses,m.ties,m.total])
  //     m.board.forEach(r=>console.log(r))
  //   })
  // }

  function Move(board,p) {
    this.parent = p || null;
    this.board = board || b;
    this.letter = !p || this.parent.letter === 'X' ? 'O' : 'X';
    this.wins = 0;
    this.losses = 0;
    this.ties = 0;
    this.total = 0;
    this.children = [];
  }

  Move.prototype.gameOver = function() {
    return wins.some(w=>w.every(p=>this.board[p[0]][p[1]]===this.letter));
  };

  Move.prototype.update = function(res) {
    var node = this;
    if (res === 't') {
      stats.ties++;
      while (node) {
        node.ties++;
        node.total++;
        node = node.parent;
      }
    }
    else {
      stats[this.letter]++;
      while (node) {
        node.letter === this.letter ? node.wins++ : node.losses++;
        node.total++;
        node = node.parent;
      }
    }
  };

  Move.prototype.makeTree = function() {
    if (this.gameOver()) {this.update('w')}
    else {
      this.board.forEach(function(r,i) {
        r.forEach(function(c,j) {
          if (c === ' ') {
            var nextMove = new Move(this.board.map(x=>x.slice()),this);
            nextMove.board[i][j] = nextMove.letter;
            nextMove.pos = [i,j];
            this.symmCheck(nextMove.board) && this.children.push(nextMove);
            // this.children.push(nextMove);
          }
        }.bind(this));
      }.bind(this));
      this.children.length ? this.children.forEach(c=>c.makeTree()) : this.update('t');
    }
  };

  Move.prototype.symmCheck = function(b) {
    return this.children.every(c=>
      !symms.some(sym=>
        c.board.every((r,i)=>
          r.every((s,j)=>
            s===b[sym[i][j][0]][sym[i][j][1]]
          )
        )
      )
    )
  }

  Move.prototype.countNodes = function() {
    var nodes = 0;
    var nodesPlayed = 0
    var leaves = 0;
    var leavesPlayed = 0
    c.call(this);
    return {nodes:nodes,nodesPlayed:nodesPlayed,leaves:leaves,leavesPlayed:leavesPlayed};
    function c() {
      nodes++;
      this.played && nodesPlayed++
      if (!this.children.length) {
        leaves++
        this.played && leavesPlayed++
      }
      else {
        this.children.forEach(ch=>c.call(ch)); 
      }
    }
  };

  function pick(a,b) {
    return p(b) > p(a) ? b : a
    function p(n) {
      // return (n.wins - n.losses - (n.ties/2))/n.total
      return (n.wins - n.losses)/n.total
    }
  }

  Move.prototype.go = function() {
    if (this.children.length) {
      var move = this.children.reduce(pick);
      move.played = true;
      games[games.length-1].moves.push(Object.assign({},move))
      move.go();
    }
    else {
      !this.leafID && (this.leafID = id++)
      games[games.length-1].leafID = this.leafID
      if (this.gameOver()) {
        games[games.length-1].res = this.letter
        this.update('w');
      }
      else {
        games[games.length-1].res = 'tie'
        this.update('t');
      }
    }
  };

  var tree = new Move();
  tree.makeTree();

  var orig = Object.assign({},stats)

  for (var i = 0 ; i < 17000 ; i++) {
    games.push(new Game(i+1))
    games[games.length-1].moves.push(tree)
    tree.go();
  }
  console.log({X:stats.X-orig.X,O:stats.O-orig.O,ties:stats.ties-orig.ties})
  console.log(tree.countNodes())

  return {
    tree: tree,
    games: games.filter(x=>x.res==='X'||x.res==='O')
  }
  
})();

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: data.tree,
      games: data.games,
      game: 0,
      move: 0,
    };
  }
  
  load() {
    setTimeout(() => this.moving(),1000)
  }
  
  moving() {
    if (this.state.games[this.state.game].moves[this.state.move].children.length) {
      var oldmove = this.state.move
      this.setState({move:oldmove+1})
    }
    else if (this.state.game < this.state.games.length-1) {
      var oldgame = this.state.game
      this.setState({game:oldgame+1,move:0})
    }
  }
    
  renderBoard() {
    var three = new Array(3).fill(1)
    return (
      <div className='board'>{three.map(renderRow.bind(this))}</div>
    )
    function renderRow(r,i) {
      return (
        <div className='rows'>{three.map(renderSquare.bind(this))}</div>
      )
      function renderSquare(s,j) {
        return <div className='square' pos={[i,j]}>{this.state.games[this.state.game].moves[this.state.move].board[i][j]}</div>
      }
    }
  }

  render() {
    this.load()
    var currGame = this.state.games[this.state.game]
    var currMove = currGame.moves[this.state.move]
    return (
      <div id='main'>
        <div className='stats'>
          <div>Game No.: {currGame.number}</div>
          <div>leafID: {currGame.leafID} - res: {currGame.res} - Moves: {currGame.moves.length}</div>
        </div>
        <div>Playing: {currMove.letter} - ratio: {(currMove.wins-currMove.losses)/currMove.total}</div>
        <div>{this.renderBoard()}</div>
      </div>
    )
  }
}

ReactDOM.render(<Application />, document.getElementById("app"));
