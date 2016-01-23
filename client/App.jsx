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
          <input type="text" ref="nameInput" placeholder="Enter the name"/>
          <input type="text" ref="urlInput" placeholder="Enter the url"/>
          <input className="btn" type="submit"></input>
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
    var urlInput = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();

    Meteor.call('addService', newName,urlInput );

    //removing content from form must be done as page doesn't reload
    ReactDOM.findDOMNode(this.refs.nameInput).value = '';
  }
});