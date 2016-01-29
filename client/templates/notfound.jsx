NotFound = React.createClass({
  render() {
    return (
      <div className="row">
        <div className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.signIn}>
          <div className="card">
            <div className="card-image">
              <img src="unicorn.png"/>
            </div>
            <div className="card-content center-align">
              <span className="card-title">Oh noes!</span>
              <p>Sorry, the page you requested does not exist</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
});