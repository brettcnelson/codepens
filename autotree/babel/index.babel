var data = (function() {
  function Node(n,d) {
    this.val = n
    this.d = d
    this.right = this.left = null
  }

  var metaData = {1:0,count:0}

  Node.prototype.add = function(n,d) {
    d = d || 1
    var diff = 2
    if (!this.val) {
      this.val = n
      this.d = d
      metaData[d]++
      metaData.head = this
      return false
    }
    else if (n < this.val) {
      if (this.left) {
        return this.left.add(n,d+1)
      }
      else if (d < diff || metaData[d-(diff-1)] === Math.pow(2,d-diff)) {
        this.left = new Node(n,++d)
        metaData[d] ? metaData[d]++ : metaData[d] = 1
        return false
      }
      else {
        // console.log(metaData)
        // metaData.head.rebalance(n)
        this.left = new Node(n,++d)
        return true
      }
    }
    else if (this.right) {
      return this.right.add(n,d+1)
    }
    else if (d < diff || metaData[d-(diff-1)] === Math.pow(2,d-diff)) {
      this.right = new Node(n,++d)
      metaData[d] ? metaData[d]++ : metaData[d] = 1
      return false
    }
    else {
      // console.log(metaData)
      // metaData.head.rebalance(n)
      this.right = new Node(n,++d)
      return true
    }
  }

  Node.prototype.rebalance = function() {
    metaData = {1:0,count:metaData.count+1}
    var nodes = this.getNodes()
    console.log('countNodes', nodes.length)
    this.val = this.left = this.right = null
    nodes.forEach(node=>this.add(node))
  }

  Node.prototype.getNodes = function() {
    var nodes = []
    getAll.call(this)
    return logSort(nodes.sort((a,b)=>a-b))
    function getAll() {
      nodes.push(this.val)
      this.left && getAll.call(this.left)
      this.right && getAll.call(this.right)
    }
    function logSort(a) {
      var res = []
      var q = [a]
      while (q.length) {
        var node = q.shift()
        if (node.length < 2) {res.push(...node)}
        else {
          res.push(node.splice(node.length/2,1)[0])
          if (node.length > 1) {q.push(node.splice(0,Math.ceil(node.length/2)))}
          q.push(node.splice(0))
        }
      }
      return res
    }
  }

  var a = new Array(65535).fill(0).map((x,i)=>i+1)
  a.forEach(function(v,i) {
    a.push(a.splice(Math.random()*(a.length-i),1)[0])
  })
  
  function rebalance() {
    metaData.head.rebalance()
  }
  
  function resume() {
    while (a.length && !tree.add(a.shift())) {
      // console.log('=====',a.length)
    } 
    if (!a.length) {
      // rebalance()
      return true
    }
  }

  var tree = new Node()
  metaData.head = tree
  // resume()

  return {
    tree: tree,
    rebalance: rebalance,
    resume: resume
  };
})();

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curr: data.tree,
      history: [],
      forward: [],
      head: data.tree
    };
  }
  renderTree(n) {
    if (n) {
      return (
        <div className="node">
          <div className="val" onClick={() => this.selectTree(n)}>
            {n.val}
          </div>
          <div className="child left">{this.renderTree(n.left)}</div>
          <div className="child right">{this.renderTree(n.right)}</div>
        </div>
      )
    }
  }
  selectTree(n) {
    var h = this.state.history.slice();
    h.push(this.state.curr);
    this.setState({ curr: n, history: h, forward: [] });
  }
  rebalance() {
    data.rebalance()
    this.setState({})
  }
  resume() {
    data.resume()
    this.setState({})
  }
  auto() {
    var delay = 100
    data.rebalance()
    this.setState({})
    setTimeout(this.res.bind(this),delay)
  }
  res() {
    var delay = 100
    if (!data.resume()) {
      setTimeout(this.auto.bind(this),delay)
      this.setState({})
    }
    else {
      this.setState({})
      setTimeout(data.rebalance,delay)
      setTimeout(()=>this.setState({}),delay)
    }
    
  }

  render() {
    return (
      <div>
        <button onClick={() => this.rebalance()}>REBALANCE</button>
        <button onClick={() => this.resume()}>RESUME</button>
        <button onClick={() => this.auto()}>AUTO</button>
        <div id='main'>{this.renderTree(this.state.curr)}</div>
      </div>
    )
  }
}

ReactDOM.render(<Application />, document.getElementById("app"));
