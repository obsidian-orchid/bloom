//explanation: https://github.com/kadirahq/meteor-react-layout
ReactLayout.setRoot

FlowRouter.route("/", {
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Home />
    });
  }
});

FlowRouter.route("/services", {
  subscriptions: function() {
    //var selector = {category: {$ne: "private"}};
    this.register('services', Meteor.subscribe('services'));
  },
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <ServicesList />
    });
  }
});

FlowRouter.notFound = {
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <NotFound />
    });
  }
};
