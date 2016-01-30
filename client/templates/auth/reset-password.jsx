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
      <div className="row">
        <form className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.recover}>
          <div className="card">
            <div className="card-content">
              <div className="valign-wrapper">
                <h3 className="left">New Password</h3>
              </div>
              <div className="row">
                <div className="input-field col s12">
                   <i className="mdi-action-lock prefix"></i>
                  <input id="password" type="password" ref="password" className="validate"/>
                  <label htmlFor="password">Password</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 right-align">
                  <input className="btn waves-effect waves-light orange" type="submit" value="Submit"/>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  },

  recover(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var password = ReactDOM.findDOMNode(this.refs.password).value.trim();
    var token = FlowRouter.getParam("token");
    console.log(token);

     Accounts.resetPassword(token, password, function(err) {
        if (err) {
          Materialize.toast('Sorry, something went wrong', 4000);
        } else {
          Materialize.toast('You have successfully changed your password!', 4000);
        }
     });
    FlowRouter.go('/');
    return false;
  }
});