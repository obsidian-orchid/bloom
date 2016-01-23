 // This code is executed on the client only
Meteor.subscribe('services');

Meteor.startup(function () {
  // Use Meteor.startup to render the component after the page is ready
  //using ReactDOM here instead of just React.render() due to console error log
  ReactDOM.render(<App />, document.getElementById("render-target"));
});