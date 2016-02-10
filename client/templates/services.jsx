ServicesList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    var userServicesData = Meteor.subscribe('userData');
    var servicesData = Meteor.subscribe('services');
    return {
      userLoading: !userServicesData.ready(),
      servicesLoading: !servicesData.ready(),
      userServices: Meteor.users.find().fetch(),
      services: Services.find({state: true}).fetch()
    }
  },
  getInitialState() {
    return {}
  },
  add(service) {
    var authorizeWindow = function(url) {
      var left = (screen.width/2)-(400/2);
      var top = (screen.height/2)-(400/2);
      window.open(url, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=400, height= 400, top='+top+', left='+left);
    };
    console.log(service);
    var services = {
      facebook : {
        auth: function() {
          Meteor.signInWithFacebook({
            requestPermissions: ['user_posts', 'publish_actions', 'public_profile']
          }, function(err, mergedUserId) {
            if (err) {
              throw new Meteor.Error("Facebook add failed, " + err);
            }
            // mergedUsers is set if a merge occured
            if (mergedUserId) {
              console.log(mergedUserId, 'merged with', Meteor.userId());
              // Remove merged collection
              Meteor.call('removeMergedCollection', mergedUserId, function(err, result) {
                if (err) {
                  console.log('error', err);
                }
                console.log('Facebook added');
              });
            }
          });
        }
      },
      Tumblr: {
        auth: function(){
          Meteor.call('LogToTumblr', function(err, result){
            if(err){
              console.log('Merging with Tumblr failed', err);
            }
            else{
              console.log(result);
              window.open(result);
            }
          })
        }
      },
      Twitter:{
        auth: function(){
          Meteor.loginWithTwitter(function(err, result){

          })
        }

      },
      google : {
        auth: function() {
          Meteor.signInWithGoogle ({
            requestPermissions: ['https://www.googleapis.com/auth/plus.login',
              'https://www.googleapis.com/auth/userinfo.email',
              'https://www.googleapis.com/auth/plus.me',
              'https://www.googleapis.com/auth/plus.media.upload',
              'https://www.googleapis.com/auth/plus.stream.write',
              'https://www.googleapis.com/auth/userinfo.profile']
          }, function (err, mergedUserId) {
            if (err) {
              console.log('error', err);
            }
            // mergedUsers is set if a merge occured
            if (mergedUserId) {
              console.log(mergedUserId, 'merged with', Meteor.userId());
              // Remove merged collection
              Meteor.call('removeMergedCollection', mergedUserId, function(err, result) {
                if (err) {
                  console.log('error', err);
                }
              });
            }
          })
        }
      },
      imgur: {
        auth: function() {
          Meteor.call('imgurAuthLink', function(err, result) {
            authorizeWindow(result);
          });
        }
      },
      pinterest: {
        auth: function() {
          Meteor.call('pinterestAuthLink', function(err, result){
            authorizeWindow(result);
          });
        }
      }
    };
    services[service].auth();
    Meteor.call('toggleServiceCommon', service, true, function(err, result) {
      console.log('service state: ', result);
    });
  },
  remove(service) {
    var id = Meteor.userId();
    Meteor.call('removeService', id, service, function(err, result) {
      console.log('logged out of ', result)
    });
    Meteor.call('toggleServiceCommon', service, false, function(err, result) {
      console.log('service state: ', result);
    });
  },
  activeAppList() {
    var services = this.data.services;
    var userServices = this.data.userServices[0].services;

    return _.reduce(userServices, function(acc, userService, key) {
      _.each(services, function(service) {
        if(service.name === key) {
          acc[key] = {
            'name': key,
            'state': userService.state
          }
        }
      });
      return acc;
    }, {});

  },
  render() {
    if (this.data.userLoading && this.data.servicesLoading) {
      console.log('userServices: ', this.data.userServices[0]);
      console.log('activeAppList: ', this.activeAppList());
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }
    return (
      <div>
        <AppServiceList activeAppList={this.activeAppList()} services={this.data.services} add={this.add} remove={this.remove} />
      </div>
    )
  }
});

/*
 AppServiceList
 */
var AppServiceList = React.createClass({
  _DEV_renderServiceList(key) {
    var service = this.props.services[key].name;
    //return (
    //  <div key={service.name}>
    //    <button className={"btn-large social-button " + service.name } onClick={this.props.add.bind(null, service.name)}>Add {service.name}</button>
    //    <button className={"btn-large social-button " + service.name } onClick={this.props.remove.bind(null, service.name)}>Remove {service.name}</button>
    //    <br /><br />
    //  </div>
    //)

    var serviceState = this.props.activeAppList[service];
    //
    if (serviceState && serviceState.state === true) {
      return (
        <div key={service}>
          <button className={"btn-large social-button " + service } onClick={this.props.remove.bind(null, service)}>Remove {service}</button>
          <br /><br />
        </div>
      )
    }
    return (
      <div key={service}>
        <button className={"btn-large social-button " + service } onClick={this.props.add.bind(null, service)}>Add {service}</button>
        <br /><br />
      </div>
    )
  },
  loginTwitter(options, callback) {
    Meteor.call('twitterGetToken', function(err, result) {
      OAuth_SS.authorizeWindow(result);
      // console.log('result: ', result);
    })
    // if (! callback && typeof options === "function") {
    //   callback = options;
    //   options = null;
    // }

    // var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    // TwitterSS.requestCredential(options, credentialRequestCompleteCallback);
  },
  loginTumblr(options, callback) {
    Meteor.call('tumblrGetToken', function(err, result) {
      OAuth_SS.authorizeWindow(result)
      // console.log('result: ', result);
    })
  },
  testTwitterPost(){
    Meteor.call('twitterPost', function(err, results){});
  },
  renderServiceList(service) {
    //console.log('check2: ', this.props.activeAppList[service]);
    var serviceState = this.props.activeAppList[service].state;

    if (serviceState) {
      return (
        <div key={service}>
          <button className={"btn-large social-button " + service } onClick={this.props.remove.bind(null, service)}>Remove {service}</button>
          <br /><br />
        </div>
      )
    }
    return (
      <div key={service}>
        <button className={"btn-large social-button " + service } onClick={this.props.add.bind(null, service)}>Add {service}</button>
        <br /><br />
      </div>
    )
  },
  render: function () {
    // console.log('services: ', this.props.services);
    // console.log('active services: ', this.props.activeAppList);
    //<p className="flow-text">MANAGE SERVICES</p>
    //    {Object.keys(this.props.activeAppList).map(this.renderServiceList)}
    //    <br /><br />
    //    <br /><br />
    //    <br /><br />
    //    <br /><br />
    //    <button className="btn" onClick={this.loginTwitter}>Test Twitter</button>
    //    <br /><br />
    //    <button className="btn" onClick={this.loginTumblr}>Test Tumblr</button>
    //    <br /><br />
    return (
      <div>
        <p className="flow-text">MANAGE SERVICES</p>
        {Object.keys(this.props.services).map(this._DEV_renderServiceList)}
        <p>BACK TO <a href="/">UPLOADS</a></p>
      </div>
    )
  }
});