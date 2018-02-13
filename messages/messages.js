var data = (function() {
	var getId = (function() {
		var userids = 1
		var tweetids = 1
		return function(type) {
			return type === 'u' ? userids++ : tweetids++
		}
	})()
	
	var tweets = []
	var users = []
	
	function Tweet(id,userid,name,txt,parent,thread) {
		this.id = id
		this.userid = userid
		this.name = name
		this.txt = txt
		this.parent = parent
		this.replies = []
		this.threadPos = thread
		this.threads = []
	}
	
	function addUser(name) {
		var id = getId('u')
		var user = new User(id,name)
		users.push(user)
		return user
	}
	
	function User(id,name) {
		this.id = id
		this.name = name
		this.tweets = []
	}
	
	User.prototype.tweet = function(txt,par,t) {
		var id = getId()
		var tweet = new Tweet(id,this.id, this.name,txt,par,t)
		this.tweets.push(tweet)
		tweets.push(tweet)
		return tweet
	}
	
	User.prototype.reply = function(par,txt) {
		var reply = this.tweet(txt,par)
		par.replies.push(reply)
	}
	
	User.prototype.thread = function(par,txt) {
		if (!par.threadPos) {par.threadPos = 1}
    var t = par.threadPos + 1
		var thread = this.tweet(txt,par,t)
		par.threads.push(thread)
	}
  
  function makeTweet(u,t,c,d) {
    u = !users[u] ? addUser(u) : users[u]
    if (!d) {u.tweet(t)}
    if (d === 1) {u.reply(c,t)}
    if (d === 2) {u.thread(c,t)}
  }
  
  function countTweets() {
    var count = 0
    counter(tweets.filter(t=>!t.parent))
    return count
    function counter(a) {
      count += a.length
      a.forEach(t=>counter(t.replies))
      a.forEach(t=>counter(t.threads))
    }
  }
  
  function longestThread() {
    var threads = []
    tweets.filter(t=>!t.parent).forEach(t=>findHead(t))
    return threads
      // .filter(v=>v[1]>3)
    function findHead(t) {
      if (t.threadPos) {threads.push(findThreads(t))}
      // if (t.threads.length || (t.parent && t.parent.threads.filter(tree=>tree===t)[0] === t)) {threads.push(findThreads(t))}
      t.replies.forEach(r=>findHead(r))
    }
    function findThreads(t) {
      var nodes = []
      inner(t)
      function inner(t) {
        nodes.push([t.id,t.threadPos])
        t.threads.forEach(function(t) {
          inner(t)
        })
      }
      return nodes
    }
  }

  for (let i = 0 ; i < 10 ; i++) {
    addUser(i*i)
    users[i].tweet('I am ' + users[i].name + ' and my ID is ' + users[i].id)
  }
  
  for (let i = 0 ; i < 100 ; i++) {
    users.forEach(function(u) {
      var num = Math.random()
      var tweet = tweets[Math.floor(num*tweets.length)]
      num < .1 ? u.tweet(u.name + ' i am tweeting') : num < .5 ? u.reply(tweet,' replying') : u.thread(tweet, ' threading')
    })
  }
	
	return {
		tweets:tweets,
		users:users,
		addUser:addUser,
    tweet:makeTweet,
    countTweets:countTweets,
    longestThread:longestThread
	}
})()

function Reply(props) {
  var thread = 'REPLY '
  if (props.t.threadPos) {thread = props.t.threadPos === 1 ? 'repTHREADhead ' + props.t.threadPos : props.t.threads.length ? 'THREADING ' + props.t.threadPos : 'THREADtail ' + props.t.threadPos}
  return (
    <div className='tweet reply'>
      <div className='tweetHeader replyHeader' onClick={props.user}>{props.t.name + ' ::replying to ' + props.t.parent.name}</div>
      <div className='tweetText replyText' onClick={props.tweet}>{thread + props.t.txt}</div>
      <div className='tweetID'>{'id:'+props.t.id}</div>
    </div>
  )
}

function Tweet(props) {
  var thread = props.t.threadPos ? 'TWEET - threadHEAD ' : 'TWEET '
  return (
    <div className='tweet'>
      <div className='tweetHeader' onClick={props.user}>{props.t.name + ':'}</div>
      <div className='tweetText' onClick={props.tweet}>{thread + props.t.txt}</div>
      <div className='tweetID'>{'id:'+props.t.id}</div>
    </div>
  )
}

var Users = props => (
  <div>{props.i + ': ' + props.user.name}</div>
)

var UserList = props => (
  <div className='usersNav'>USERS
    <div className='userList'>{props.data.users.map((u,i) => <Users i={i} user={u} />)}</div>
 </div>
)

class Application extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      curr:false,
      hist: []
    }
  }
  renderTweets(curr) {
    // window.scrollTo(0, 0)
    return !curr ?
      this.renderAllTweets() :
      typeof curr === 'object' ?
        this.renderTree(curr) :
        this.renderUserTweets(curr)
        
  }
  tweetFactory(t) {
    var user = () => this.userClick(t.userid)
    var tweet = () => this.tweetClick(t)
    return !t.parent ?
      <Tweet t={t} user={user} tweet={tweet} /> :
      <Reply t={t} user={user} tweet={tweet} />
  }
  renderAllTweets() {
    return <div className='allTweets'>{data.tweets.slice().reverse().map(this.tweetFactory.bind(this))}</div>
  }
  renderUserTweets(u) {
    var userTweets = data.users.filter(n=>n.id === u)[0].tweets.slice().reverse()
    return <div>{u + '\'s tweets'}
            <div className='userTweets'>{userTweets.map(this.tweetFactory.bind(this))}</div>
          </div>
  }
  findThreads(t) {
    var threads = [[],[]]
    var tree
    if (t.parent) {
      if (t.threadPos < 2) {threads[0].push(t.parent)}
      else {
        tree = t
        while (tree.parent && tree.threadPos !== 1) {
         tree = tree.parent
         threads[0].push(tree)
       }
      }
    }
    tree = t
    while (tree.threads.length) {
      tree = tree.threads[0]
      threads[1].push(tree)
    } 
    return threads
  }
  renderTree(t) {
    var norep = !t.replies.length ? 'no replies' : ''
    var threads = this.findThreads(t)
    var par = threads[0].reverse()
    var repThread = threads[1]
    var threadReplies = t.threads.slice(1)
    return (
      <div className='tweetTree'>
        <div className='parent'>{par.map(this.tweetFactory.bind(this))}</div>
        <div className='current'>{this.tweetFactory(t)}</div>
        <div className='thread'>{repThread.map(this.tweetFactory.bind(this))}</div>
        <div className='threadReplies'>{threadReplies.reverse().map(this.tweetFactory.bind(this))}</div>
        <div className='replies'>
          {t.replies.slice().reverse().map(r =>
            <Reply
              t={r}
              user={() => this.userClick(r.id)}
              tweet={() => this.tweetClick(r)}
            />         
          )}
        </div>
        <div>{norep}</div>
      </div>
    )
  }
  tweetClick(t) {
    if (this.state.curr !== t) {
      this.updateHistory()
      this.setState({curr:t})
    }
  }
  userClick(id) {
    if (this.state.curr !== id) {
      this.updateHistory()
      this.setState({curr:id})
    }
    else {window.scrollTo(0, 0)}
  }
  updateHistory() {
    var h = this.state.hist.slice()
    h.push({curr:this.state.curr})
    this.setState({hist:h})
  }
  home() {
    if (this.state.curr) {
      this.updateHistory()
      this.setState({curr:false})
    }
  }
  back() {
    if (this.state.hist.length) {
      var prev = this.state.hist.pop()
      this.setState({curr:prev.curr})
    }
  }
  tweet(d) {
    var u = prompt('which user??')
    var t = prompt('what\'s your tweet?')
    var c = this.state.curr
    data.tweet(u,t,c,d)
    this.setState(prevState => 
      {curr:prevState.curr}
    )
  }
  render() {
    return (
      <div>
        <div className='buttons'>
          <button onClick={this.home.bind(this)}>HOME</button>
          <button onClick={this.back.bind(this)}>(----</button>
          <button onClick={() => this.tweet()}>TWEET</button>
          <button onClick={() => this.tweet(1)}>REPLY</button>
          <button onClick={() => this.tweet(2)}>THREAD</button>
        </div>
        <div className='tweetList'>{this.renderTweets(this.state.curr)}</div>
        <UserList data={data}/>
      </div>
    )
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));

