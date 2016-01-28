
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
        <form className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.signIn}>
          <div className="card">
            <div className="card-content">
              <div className="valign-wrapper">
                <h3 className="left">Welcome</h3>
                <a href="/register" className="title-btn waves-effect waves-teal btn-flat right">Sign up</a>
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
                  <a href="/reset-password" className="waves-effect waves-teal btn-flat">Forgot password?</a>
                  <input className="btn waves-effect waves-light" type="submit" value="Sign In"/>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  },

  signIn(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    var password = ReactDOM.findDOMNode(this.refs.password).value.trim();

    // Calling the loginWithPassword function on the user
     Meteor.loginWithPassword(email, password, function(error) {
         if (error) {
          // Returning a sweetAlert
          console.log('error occurred');
         } else {
           var redirect = Session.get('redirectAfterLogin');
           if(redirect !== '/signin'){
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

Register = React.createClass({

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
        <form className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.register}>
          <div className="card">
            <div className="card-content">
              <div className="valign-wrapper">
                <h3 className="left">Join us</h3>
                <a href="/signin" className="title-btn waves-effect waves-teal btn-flat right">Sign in</a>
              </div>
              <div className="row">
                <div className="input-field col s6">
                  <i className="mdi-action-account-box prefix"></i>
                  <input id="fname" type="text" ref="fname" className="validate"/>
                  <label htmlFor="fname">First name</label>
                </div>
                <div className="input-field col s6">
                  <input id="lname" type="text" ref="lname" className="validate"/>
                  <label htmlFor="lname">Last name</label>
                </div>
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
                  <input className="btn waves-effect waves-light" type="submit" value="Sign Up"/>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

    );
  },

  register(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var fname = ReactDOM.findDOMNode(this.refs.fname).value.trim();
    var lname = ReactDOM.findDOMNode(this.refs.lname).value.trim();
    var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    var password = ReactDOM.findDOMNode(this.refs.password).value.trim();
    //var cpassword = ReactDOM.findDOMNode(this.refs.cpassword).value.trim();

    Accounts.createUser({
      email: email,
      firstName: fname,
      lastName: lname,
      password: password
    }, function (error){
      if(error){
        console.log(error.reason);
      }
      else{
        FlowRouter.go('/');
      }
    });
    return false;
  }
});

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
        <form className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.signIn}>
          <div className="card">
            <div className="card-content">
              <div className="valign-wrapper">
                <h3 className="left">Reset Password</h3>
              </div>
              <div className="row">
                <div className="input-field col s12">
                   <i className="mdi-content-mail prefix"></i>
                  <input id="email" type="email" ref="email" className="validate"/>
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 right-align">
                  <a href="/signin" className="waves-effect waves-teal btn-flat">Nevermind</a>
                  <input className="btn waves-effect waves-light" type="submit" value="Continue"/>
                </div>
              </div>
            </div>
          </div>
        </form>
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

ConfirmReset = React.createClass({

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
        <form onSubmit={this.register}>
          <input type="email" ref="email" placeholder="Email"/>
          <input className="ui primary button" type="submit" value="Send Password Reset"></input>
        </form>
        <a href="/signin">Sign In</a>
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