var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var data = function () {
  var getId = function () {
    var userids = 1;
    var tweetids = 1;
    return function (type) {
      return type === 'u' ? userids++ : tweetids++;
    };
  }();

  var tweets = [];
  var users = [];

  function Tweet(id, userid, name, txt, parent, thread) {
    this.id = id;
    this.userid = userid;
    this.name = name;
    this.txt = txt;
    this.parent = parent;
    this.replies = [];
    this.threadPos = thread;
    this.threads = [];
  }

  function addUser(name) {
    var id = getId('u');
    var user = new User(id, name);
    users.push(user);
    return user;
  }

  function User(id, name) {
    this.id = id;
    this.name = name;
    this.tweets = [];
  }

  User.prototype.tweet = function (txt, par, t) {
    var id = getId();
    var tweet = new Tweet(id, this.id, this.name, txt, par, t);
    this.tweets.push(tweet);
    tweets.push(tweet);
    return tweet;
  };

  User.prototype.reply = function (par, txt) {
    var reply = this.tweet(txt, par);
    par.replies.push(reply);
  };

  User.prototype.thread = function (par, txt) {
    if (!par.threadPos) {
      par.threadPos = 1;
    }
    var t = par.threadPos + 1;
    var thread = this.tweet(txt, par, t);
    par.threads.push(thread);
  };

  function makeTweet(u, t, c, d) {
    u = !users[u] ? addUser(u) : users[u];
    if (!d) {
      u.tweet(t);
    }
    if (d === 1) {
      u.reply(c, t);
    }
    if (d === 2) {
      u.thread(c, t);
    }
  }

  function countTweets() {
    var count = 0;
    counter(tweets.filter(function (t) {
      return !t.parent;
    }));
    return count;
    function counter(a) {
      count += a.length;
      a.forEach(function (t) {
        return counter(t.replies);
      });
      a.forEach(function (t) {
        return counter(t.threads);
      });
    }
  }

  function longestThread() {
    var threads = [];
    tweets.filter(function (t) {
      return !t.parent;
    }).forEach(function (t) {
      return findHead(t);
    });
    return threads;
    // .filter(v=>v[1]>3)
    function findHead(t) {
      if (t.threadPos) {
        threads.push(findThreads(t));
      }
      // if (t.threads.length || (t.parent && t.parent.threads.filter(tree=>tree===t)[0] === t)) {threads.push(findThreads(t))}
      t.replies.forEach(function (r) {
        return findHead(r);
      });
    }
    function findThreads(t) {
      var nodes = [];
      inner(t);
      function inner(t) {
        nodes.push([t.id, t.threadPos]);
        t.threads.forEach(function (t) {
          inner(t);
        });
      }
      return nodes;
    }
  }

  for (var i = 0; i < 10; i++) {
    addUser(i * i);
    users[i].tweet('I am ' + users[i].name + ' and my ID is ' + users[i].id);
  }

  for (var _i = 0; _i < 100; _i++) {
    users.forEach(function (u) {
      var num = Math.random();
      var tweet = tweets[Math.floor(num * tweets.length)];
      num < .1 ? u.tweet(u.name + ' i am tweeting') : num < .5 ? u.reply(tweet, ' replying') : u.thread(tweet, ' threading');
    });
  }

  return {
    tweets: tweets,
    users: users,
    addUser: addUser,
    tweet: makeTweet,
    countTweets: countTweets,
    longestThread: longestThread
  };
}();

function Reply(props) {
  var thread = 'REPLY ';
  if (props.t.threadPos) {
    thread = props.t.threadPos === 1 ? 'repTHREADhead ' + props.t.threadPos : props.t.threads.length ? 'THREADING ' + props.t.threadPos : 'THREADtail ' + props.t.threadPos;
  }
  return React.createElement(
    'div',
    { className: 'tweet reply' },
    React.createElement(
      'div',
      { className: 'tweetHeader replyHeader', onClick: props.user },
      props.t.name + ' ::replying to ' + props.t.parent.name
    ),
    React.createElement(
      'div',
      { className: 'tweetText replyText', onClick: props.tweet },
      thread + props.t.txt
    ),
    React.createElement(
      'div',
      { className: 'tweetID' },
      'id:' + props.t.id
    )
  );
}

function Tweet(props) {
  var thread = props.t.threadPos ? 'TWEET - threadHEAD ' : 'TWEET ';
  return React.createElement(
    'div',
    { className: 'tweet' },
    React.createElement(
      'div',
      { className: 'tweetHeader', onClick: props.user },
      props.t.name + ':'
    ),
    React.createElement(
      'div',
      { className: 'tweetText', onClick: props.tweet },
      thread + props.t.txt
    ),
    React.createElement(
      'div',
      { className: 'tweetID' },
      'id:' + props.t.id
    )
  );
}

var Users = function Users(props) {
  return React.createElement(
    'div',
    null,
    props.i + ': ' + props.user.name
  );
};

var UserList = function UserList(props) {
  return React.createElement(
    'div',
    { className: 'usersNav' },
    'USERS',
    React.createElement(
      'div',
      { className: 'userList' },
      props.data.users.map(function (u, i) {
        return React.createElement(Users, { i: i, user: u });
      })
    )
  );
};

var Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this.state = {
      curr: false,
      hist: []
    };
    return _this;
  }

  _createClass(Application, [{
    key: 'renderTweets',
    value: function renderTweets(curr) {
      // window.scrollTo(0, 0)
      return !curr ? this.renderAllTweets() : (typeof curr === 'undefined' ? 'undefined' : _typeof(curr)) === 'object' ? this.renderTree(curr) : this.renderUserTweets(curr);
    }
  }, {
    key: 'tweetFactory',
    value: function tweetFactory(t) {
      var _this2 = this;

      var user = function user() {
        return _this2.userClick(t.userid);
      };
      var tweet = function tweet() {
        return _this2.tweetClick(t);
      };
      return !t.parent ? React.createElement(Tweet, { t: t, user: user, tweet: tweet }) : React.createElement(Reply, { t: t, user: user, tweet: tweet });
    }
  }, {
    key: 'renderAllTweets',
    value: function renderAllTweets() {
      return React.createElement(
        'div',
        { className: 'allTweets' },
        data.tweets.slice().reverse().map(this.tweetFactory.bind(this))
      );
    }
  }, {
    key: 'renderUserTweets',
    value: function renderUserTweets(u) {
      var userTweets = data.users.filter(function (n) {
        return n.id === u;
      })[0].tweets.slice().reverse();
      return React.createElement(
        'div',
        null,
        u + '\'s tweets',
        React.createElement(
          'div',
          { className: 'userTweets' },
          userTweets.map(this.tweetFactory.bind(this))
        )
      );
    }
  }, {
    key: 'findThreads',
    value: function findThreads(t) {
      var threads = [[], []];
      var tree;
      if (t.parent) {
        if (t.threadPos < 2) {
          threads[0].push(t.parent);
        } else {
          tree = t;
          while (tree.parent && tree.threadPos !== 1) {
            tree = tree.parent;
            threads[0].push(tree);
          }
        }
      }
      tree = t;
      while (tree.threads.length) {
        tree = tree.threads[0];
        threads[1].push(tree);
      }
      return threads;
    }
  }, {
    key: 'renderTree',
    value: function renderTree(t) {
      var _this3 = this;

      var norep = !t.replies.length ? 'no replies' : '';
      var threads = this.findThreads(t);
      var par = threads[0].reverse();
      var repThread = threads[1];
      var threadReplies = t.threads.slice(1);
      return React.createElement(
        'div',
        { className: 'tweetTree' },
        React.createElement(
          'div',
          { className: 'parent' },
          par.map(this.tweetFactory.bind(this))
        ),
        React.createElement(
          'div',
          { className: 'current' },
          this.tweetFactory(t)
        ),
        React.createElement(
          'div',
          { className: 'thread' },
          repThread.map(this.tweetFactory.bind(this))
        ),
        React.createElement(
          'div',
          { className: 'threadReplies' },
          threadReplies.reverse().map(this.tweetFactory.bind(this))
        ),
        React.createElement(
          'div',
          { className: 'replies' },
          t.replies.slice().reverse().map(function (r) {
            return React.createElement(Reply, {
              t: r,
              user: function user() {
                return _this3.userClick(r.id);
              },
              tweet: function tweet() {
                return _this3.tweetClick(r);
              }
            });
          })
        ),
        React.createElement(
          'div',
          null,
          norep
        )
      );
    }
  }, {
    key: 'tweetClick',
    value: function tweetClick(t) {
      if (this.state.curr !== t) {
        this.updateHistory();
        this.setState({ curr: t });
      }
    }
  }, {
    key: 'userClick',
    value: function userClick(id) {
      if (this.state.curr !== id) {
        this.updateHistory();
        this.setState({ curr: id });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, {
    key: 'updateHistory',
    value: function updateHistory() {
      var h = this.state.hist.slice();
      h.push({ curr: this.state.curr });
      this.setState({ hist: h });
    }
  }, {
    key: 'home',
    value: function home() {
      if (this.state.curr) {
        this.updateHistory();
        this.setState({ curr: false });
      }
    }
  }, {
    key: 'back',
    value: function back() {
      if (this.state.hist.length) {
        var prev = this.state.hist.pop();
        this.setState({ curr: prev.curr });
      }
    }
  }, {
    key: 'tweet',
    value: function tweet(d) {
      var u = prompt('which user??');
      var t = prompt('what\'s your tweet?');
      var c = this.state.curr;
      data.tweet(u, t, c, d);
      this.setState(function (prevState) {
        curr: prevState.curr;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'buttons' },
          React.createElement(
            'button',
            { onClick: this.home.bind(this) },
            'HOME'
          ),
          React.createElement(
            'button',
            { onClick: this.back.bind(this) },
            '(----'
          ),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this4.tweet();
              } },
            'TWEET'
          ),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this4.tweet(1);
              } },
            'REPLY'
          ),
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this4.tweet(2);
              } },
            'THREAD'
          )
        ),
        React.createElement(
          'div',
          { className: 'tweetList' },
          this.renderTweets(this.state.curr)
        ),
        React.createElement(UserList, { data: data })
      );
    }
  }]);

  return Application;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById('app'));