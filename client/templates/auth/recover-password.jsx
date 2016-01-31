RecoverPassword = React.createClass({

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
        <form className="col l6 offset-l3 m8 offset-m2 s12" onSubmit={this.send}>
          <div className="card">
            <div className="card-content">
              <div className="valign-wrapper">
                <h3 className="left">Recover Password</h3>
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
                  <a href="/signin" className="waves-effect waves-orange btn-flat">Nevermind</a>
                  <input className="btn waves-effect waves-light orange" type="submit" value="Continue"/>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

    );
  },

  send(event){

    //stops page reloading
    event.preventDefault();

    //retrieving text from React ref tag
    //trimming to remove whitespace surrounding text
    var email = ReactDOM.findDOMNode(this.refs.email).value.trim();

     Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            Materialize.toast('This account does not exist!', 4000);
          } else {
            Materialize.toast('Sorry, something went wrong!', 4000);
          }
        } else {
          Materialize.toast('Email sent! Please check your inbox', 4000);
        }
      });
    return false;
  }
});