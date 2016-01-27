imageDetails = new Mongo.Collection('imageDetails');

MainLayout = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      //returning alphabetically sorted services
      currentUser: Meteor.user()
    };
  },

  componentDidMount() {
    $(".button-collapse").sideNav();
  },
  render() {
    var authBtn;
    if(!Meteor.user()){
      authBtn = <li><a href="/signin">Sign In</a></li>
    }
    else{
      authBtn = <li><a onClick={this.signOut}>Sign Out</a></li>
    }
    return (
      <div className="page-content">
        <header>
          <nav>
          <div className="nav-wrapper container">
            <a href="/" className="brand-logo">
            <img className="logo-img" src="orchid.png"/>
              BLOOM
            </a>
            <a href="" data-activates="mobile-demo" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
            <ul className="right hide-on-med-and-down">
              <li><a href="/services">Services</a></li>
              {authBtn}
            </ul>
            <ul className="side-nav" id="mobile-demo">
              <li><a href="/services">Services</a></li>
              {authBtn}
            </ul>
          </div>
        </nav>
        </header>
        <main>
          <div className="container">
            <div className="row">
              <div className="col s12 m12 l12">
                <div className="section">
                  {this.props.content}
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="page-footer">
          <div className="footer-copyright">
            <div className="container">
            © 2016 Obsidian Orchid
            <a className="grey-text text-lighten-4 right" href="">Support</a>
            </div>
          </div>
        </footer>
      </div>
    )

  },

  signOut(event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('/signin');
  }

});