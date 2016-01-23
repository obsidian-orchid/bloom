Services = new Mongo.Collection('services');

if (Meteor.isClient) {
  // This code is executed on the client only

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    //using ReactDOM here instead of just React.render() due to console error log
    ReactDOM.render(<App />, document.getElementById("render-target"));
  });
}


App = React.createClass({

  //allows us to use getMeteorData() by just saying this.data
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      //returning alphabetically sorted services
      services: Services.find({}, {sort: {name}}).fetch()
    };
  },

  getServices(){
    return [
      {_id: 1, name: "Flickr"},
      {_id: 2, name: "Tumblr"},
      {_id: 3, name: "Facebook"}
    ];
  },

  renderServices(){
    return this.data.services.map((service) => {
      return <Service key={service._id} service={service} />
    });
  },

  render(){
    return (
      <div className="container">
        <form className="new-service" onSubmit={this.submitNewService}>
          <input type="text" ref="nameInput" placeholder="Enter new service here"/>
        </form>
        <ul>
          {this.renderServices()}
        </ul>
      </div>
    );
  },

  submitNewService(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var newName = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();

    Services.insert({
      name: newName
    });

    //removing content from form must be done as page doesn't reload
    ReactDOM.findDOMNode(this.refs.nameInput).value = '';
  }
});