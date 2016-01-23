if (Meteor.isClient) {
  // This code is executed on the client only

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    ReactDOM.render(<App />, document.getElementById("render-target"));
  });
}


App = React.createClass({
  getServices(){
    return [
      {_id: 1, name: "Flickr"},
      {_id: 2, name: "Tumblr"},
      {_id: 3, name: "Facebook"}
    ];
  },

  renderServices(){
    return this.getServices().map((service) => {
      return <Service key={service._id} service={service} />
    });
  },

  render(){
    return (
      <div className="container">
        <ul>
          {this.renderServices()}
        </ul>
      </div>
    );
  }
});