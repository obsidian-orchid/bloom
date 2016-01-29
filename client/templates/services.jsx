const LoginButtons = BlazeToReact('loginButtons');

ServicesList = React.createClass({

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

  login(e){
    Meteor.signInWithGoogle ({}, function (error, mergedUserId) {
      if (error) {
        console.log('error', error);
      }
      // mergedUserId is set if a merge occured
      if (mergedUserId) {
        console.log(mergedUserId, 'merged with', Meteor.userId());

    // The source account (mergedUserId) has now been deleted, so now is
    // your chance to deal with you application specific DB items to avoid
    // ending up with orphans. You'd typically want to change owner on the
    // items belonging to the deleted user, or simply delete them
        Meteor.call ('mergeItems', mergedUserId, function (error, result) {
          if (error) {
            console.log('error', error);
          }
          if (result) {
            console.log('result', result);
          }
        });
      }
    });
    e.preventDefault();
  },

  logout: function(event) {
    Meteor.logout(function(err) {
      if (err) {
        throw new Meteor.Error("Logout failed");
      }
      console.log('Google_logout: ', event);
    })
  },

  render(){
    return (
      <div>
        <form className="new-service" onSubmit={this.addService}>
          <input type="text" ref="nameInput" placeholder="Enter the name"/>
          <input type="text" ref="urlInput" placeholder="Enter the url"/>
          <input className="btn" type="submit"></input>
        </form>
        <br></br>
        <div>
          <button className="btn" id="google-login" onClick={ this.login }>Add Google</button>
          <button className="btn" id="logout" onClick={ this.logout }>Remove Google</button>
          <p className="flow-text">Test Photo Post</p>
          <button className="btn" id="post-photo">Post photos</button>
        </div>
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

Service = React.createClass({
  propTypes: {
    service: React.PropTypes.object.isRequired
  },

  deleteService(event){
    event.preventDefault();
    Meteor.call('deleteService', this.props.service._id);
  },

  render(){
    return (
      <li>
        <span>{this.props.service.name}</span>
        <a href="" className="delete" onClick={this.deleteService}> &times;</a>
      </li>
    );
  }
});

