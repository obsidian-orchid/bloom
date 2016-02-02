Signin = React.createClass({

  //allows us to use getMeteorData() by just saying this.data
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      //returning alphabetically sorted services
      currentUser: Meteor.user()
    };
  },

  //renderServices(){
  //    return<AccountsUIWrapper />
  //},

  render(){
    return (
      <div className="row">
        <form className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.signin}>
          <div className="card">
            <div className="card-content">
              <div className="valign-wrapper">
                <h3 className="left">Welcome</h3>
                <a href="/signup" className="title-btn waves-effect waves-orange btn-flat right">Sign up</a>
              </div>
              <div className="row">
                <div className="input-field col s12">
                   <i className="mdi-content-mail prefix"></i>
                  <input id="email" type="email" ref="email" className="validate"/>
                  <label htmlFor="email">Email</label>
                </div>
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
                  <a href="/recover-password" className="waves-effect waves-orange btn-flat">Forgot password</a>
                  <input className="btn waves-effect waves-light orange" type="submit" value="Sign In"/>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  },

  signin(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    var password = ReactDOM.findDOMNode(this.refs.password).value.trim();

    // Calling the loginWithPassword function on the user
    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        Materialize.toast('Username and password combination is invalid', 4000);
      }
      else{
        var redirect = Session.get('redirectAfterLogin');
        if(redirect !== '/signin' && redirect){
         FlowRouter.go(redirect);
        }
        else{
         FlowRouter.go('/');
        }
      }
    });
    return false;
  }
});