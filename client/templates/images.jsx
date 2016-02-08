Images = React.createClass({
  propTypes: {
    image: React.PropTypes.object.isRequired
  },
  getInitialState: function(){
    return {
      condition:false
    }
  },
  render() {
    return (
      <div className="row">
        <div className="col l6 offset-l3 m8 offset-m2 s12">
          <div className="thumbnail">
            <img className={this.state.condition ? "selected": ""} src="unicorn.png"/>
            <input type="text"/>
          </div>
        </div>
      </div>
    )
  }
});