
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
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <form onSubmit={this.signIn}>
          <input type="email" ref="email" placeholder="Email"/>
          <input type="password" ref="password" placeholder="Password"/>
          <input className="btn" type="submit" value="Sign In"></input>
        </form>
        <hr/>
        <a className="left" href="/register">Register</a>
        <a className="right" href="/reset-password">Forgot Password?</a>
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
           FlowRouter.go('/');
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
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <form onSubmit={this.register}>
          <input type="text" ref="fname" placeholder="First name"/>
          <input type="text" ref="lname" placeholder="Last name"/>
          <input type="email" ref="email" placeholder="Email"/>
          <input type="password" ref="password" placeholder="Password"/>
          <input type="password" ref="cpassword" placeholder="Confirm password"/>
          <input className="btn" type="submit" value="Register"></input>
        </form>
        <hr/>
        <a href="/signin">Sign In</a>
        <ul>
        </ul>
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
    var cpassword = ReactDOM.findDOMNode(this.refs.cpassword).value.trim();

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
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <form onSubmit={this.register}>
          <input type="email" ref="email" placeholder="Email"/>
          <input className="btn" type="submit" value="Send Password Reset"></input>
        </form>
        <hr/>
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
          <input className="btn" type="submit" value="Send Password Reset"></input>
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