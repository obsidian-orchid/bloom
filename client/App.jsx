App = React.createClass({

  //allows us to use getMeteorData() by just saying this.data
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      //returning alphabetically sorted services
      services: Services.find({}, {sort: {name}}).fetch(),
      currentUser: Meteor.user()
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
        <AccountsUIWrapper />
        <form className="new-service" onSubmit={this.addService}>
          <input type="text" ref="nameInput" placeholder="Enter new service here"/>
        </form>
        <ul>
          {this.renderServices()}
        </ul>
      </div>
    );
  },

  addService(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var newName = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();

    Meteor.call('addService', newName);

    //removing content from form must be done as page doesn't reload
    ReactDOM.findDOMNode(this.refs.nameInput).value = '';
  }
});