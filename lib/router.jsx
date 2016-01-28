//explanation: https://github.com/kadirahq/meteor-react-layout
var insecure = FlowRouter.group({});

var authenticated = FlowRouter.group({
  triggersEnter: [function(){
    if(!Meteor.loggingIn() && !Meteor.userId()){
      Session.set('redirectAfterLogin', FlowRouter.current().path);
      FlowRouter.go('signin');
    }
  }]
});

authenticated.route("/", {
  name: 'home',
  subscriptions: function() {
    this.register('images', Meteor.subscribe('images'));
  },
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Home />
    });
  }
});

insecure.route("/signin", {
  name: 'signin',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Signin />
    });
  }
});

insecure.route("/register", {
  name: 'register',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Register />
    });
  }
});

insecure.route("/reset-password", {
  name: 'reset-password',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <ResetPassword />
    });
  }
});

FlowRouter.route("/api", {
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <API />
    });
  }
});

authenticated.route("/services", {
  name: 'services',
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
