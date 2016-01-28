ResetPassword = React.createClass({

  //allows us to use getMeteorData() by just saying this.data
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      //returning alphabetically sorted services
      currentUser: Meteor.user()
    };
  },

  render(){
    return (
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        wweriowperiwepori
      </div>

    );
  },

  register(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var email = ReactDOM.findDOMNode(this.refs.email).value.trim();

     Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            console.log('This email does not exist.');
          } else {
            console.log('We are sorry but something went wrong.');
          }
        } else {
          console.log('Email Sent. Check your mailbox.');
        }
      });
    return false;
  }
});