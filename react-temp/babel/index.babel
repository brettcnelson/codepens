var data = (function() {
  return {
    test: 'test'
  };
})();

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: data.test
    };
  }

  render() {
    return (
      <div>
        <div id='main'>{this.state.test}</div>
      </div>
    )
  }
}

ReactDOM.render(<Application />, document.getElementById("app"));
