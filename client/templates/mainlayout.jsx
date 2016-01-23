MainLayout = React.createClass({

  componentDidMount() {
    $(".button-collapse").sideNav();
  },
  render() {
    return (
      <div className="page-content">
        <header>
          <nav>
          <div className="nav-wrapper container">
            <a href="/" className="brand-logo">BLOOM</a>
            <a href="" data-activates="mobile-demo" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
            <ul className="right hide-on-med-and-down">
              <li><a href="">Random</a></li>
              <li><AccountsUIWrapper /></li>
            </ul>
            <ul className="side-nav" id="mobile-demo">
              <li><a href="">Random</a></li>
              <li><AccountsUIWrapper /></li>
            </ul>
          </div>
        </nav>
        </header>
        <main>
          <div className="container">
            <div className="row">
              <div className="col s12 m9 l10">
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

  }

});

//following tutorial here(https://www.meteor.com/tutorials/react/adding-user-accounts)
//to set up wrapped accounts-ui
//will add accounts-ui-unstyled later

AccountsUIWrapper = React.createClass({
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container));
  },
  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  },
  render() {
    // Just render a placeholder container that will be filled in
    return <span ref="container" />;
  }
});