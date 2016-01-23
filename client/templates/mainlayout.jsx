MainLayout = React.createClass({
  render() {
    return (
      <div>
        <header>
          This is our header
          <AccountsUIWrapper />
        </header>
        <main className="container">
          {this.props.content}
        </main>
        <footer>
          This is our footer
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