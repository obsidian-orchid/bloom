
imageDetails = new Mongo.Collection('imageDetails');

MainLayout = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      //returning alphabetically sorted services
      currentUser: Meteor.user()
    };
  },
  render() {
    var authBtn;
    if(!Meteor.user()){
      authBtn = <a href="/signin" className="item">Sign In</a>
    }
    else{
      authBtn = <a href="/signout" className="item">Sign Out</a>

    }
    return (
      <div className="page-content">
        <header>
          <div className="ui borderless main menu">
            <div className="ui text container">
              <a href="/" className="header item">
                <img className="logo" src="orchid.png" data-pin-nopin="true"/>
                BLOOM
              </a>
              <div className="right menu">
                <a href="/services" className="item">Services</a>
                {authBtn}
              </div>
            </div>
          </div>

        </header>
        <main>
          <div className="ui container">
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

//<LeftNav docked={false} open={this.state.open} onRequestChange={open => this.setState({open})}>
//            <MenuItem linkButton={true} href="/" primaryText="Home" index={1} onTouchTap={this.handleToggle}/>
//            <MenuItem linkButton={true} href="/" primaryText="Feature" index={2} onTouchTap={this.handleToggle}/>
//            <MenuItem linkButton={true} href="/" primaryText="Contact" index={3} onTouchTap={this.handleToggle}/>
//          </LeftNav>
//          <AppBar title="BLOOM"
//            onLeftIconButtonTouchTap={this.handleToggle}
//            style={{backgroundColor: Colors.deepOrange300}}
//            iconElementRight={
//              <IconMenu iconButtonElement={<IconButton><NavigationMoreVert /></IconButton>}>
//                <MenuItem primaryText="Help" index={1} />
//                {authBtn}
//              </IconMenu>
//            }
//          />