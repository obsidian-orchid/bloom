Signup = React.createClass({

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
        <form className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.signup}>
          <div className="card">
            <div className="card-content">
              <div className="valign-wrapper">
                <h3 className="left">Join us</h3>
                <a href="/signin" className="title-btn waves-effect waves-orange btn-flat right">Sign in</a>
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
                  <input className="btn waves-effect waves-light orange" type="submit" value="Sign Up"/>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

    );
  },

  signup(event){

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

        if(error.message = 'Email already exists. [403]'){
          Materialize.toast('User with this email address already exists', 4000);
        }
        else{
          Materialize.toast('Something has gone wrong!', 4000);
          console.log(error);
        }
      }
      else{
        Materialize.toast('Please check your email to verify your account!', 4000);
        FlowRouter.go('/');
      }
    });
    return false;
  }
});