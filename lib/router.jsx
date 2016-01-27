//explanation: https://github.com/kadirahq/meteor-react-layout
ReactLayout.setRoot

FlowRouter.route("/", {
  subscriptions: function() {
    this.register('images', Meteor.subscribe('images'));
  },
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Home />
    });
  }
});

FlowRouter.route("/signin", {
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Signin />
    });
  }
});

FlowRouter.route("/register", {
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Register />
    });
  }
});

FlowRouter.route("/reset-password", {
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <ResetPassword />
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
