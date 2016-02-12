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

                Meteor.call('toggleServiceCommon', service, true, function(err, result) {
                  console.log('service state: ', result);
                });
              });
            }
            Meteor.call('facebookAdd');
          });
        }
      },
      tumblr: {
        auth: function(){
          Meteor.call('LogToTumblr', function(err, result){
            if(err){
              console.log('Merging with Tumblr failed', err);
            }
            else{
              console.log(result);
              window.open(result);
              Meteor.call('toggleServiceCommon', service, true, function(err, result) {
                console.log('service state: ', result);
              });
            }
          })
        }
      },
      twitter:{
        auth: function(){
          Meteor.call('twitterGetToken', function (err, result) {
            if(err){
              console.log(err);
            }
            else{
              OAuth_SS.authorizeWindow(result);
              Meteor.call('toggleServiceCommon', service, true, function(err, result) {
                console.log('service state: ', result);
              });
            }
          });
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
              // console.log(mergedUserId, 'merged with', Meteor.userId());
              // Remove merged collection

            }
            Meteor.call('removeMergedCollection', mergedUserId, function(err, result) {
              if (err) {
                console.log('error', err);
              }
            });
          })
        }
      },
      imgur: {
        auth: function() {
          Meteor.call('imgurAuthLink', function(err, result) {
            authorizeWindow(result);
            Meteor.call('toggleServiceCommon', service, true, function(err, result) {
              console.log('service state: ', result);
            });
          });
        }
      },
      pinterest: {
        auth: function() {
          Meteor.call('pinterestAuthLink', function(err, result){
            authorizeWindow(result);
            Meteor.call('toggleServiceCommon', service, true, function(err, result) {
              console.log('service state: ', result);
            });
          });
        }
      }
    };
    services[service].auth();
  },
  remove(service) {
    var id = Meteor.userId();
    Meteor.call('removeService', id, service, function(err, result) {
      console.log('logged out of ', service)
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
      // console.log('userServices: ', this.data.userServices[0]);
      // console.log('activeAppList: ', this.activeAppList());
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
    // return (
    //  <div key={service.name}>
    //    <button className={"btn-large social-button " + service.name } onClick={this.props.add.bind(null, service.name)}>Add {service.name}</button>
    //    <button className={"btn-large social-button " + service.name } onClick={this.props.remove.bind(null, service.name)}>Remove {service.name}</button>
    //    <br /><br />
    //  </div>
    // )
    console.log(this.props.activeAppList);

    var serviceState = this.props.activeAppList[service];

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
  loginTumblr(options, callback) {
    Meteor.call('tumblrGetToken', function(err, result) {
      OAuth_SS.authorizeWindow(result);
      // console.log('result: ', result);
      // Meteor.call('toggleServiceCommon', service, true, function(err, result) {
      //   console.log('service state: ', result);
      // });
    })
  },
  testQuery(options, callback) {
    var params = { 
      accessToken: '123'
    }
    Meteor.call('addCommonService', 'imgur', params, function(err, result) {
      console.log('query: ', result);
    });
  },
  testQuery2(options, callback) {
    var params = { 
      accessToken: 'abc'
    }
    Meteor.call('addCommonService', 'pinterest', params, function(err, result) {
      console.log('query: ', result);
    });
  },
  render: function () {
    return (
      <div>
        <p className="flow-text">MANAGE SERVICES</p>
        {Object.keys(this.props.services).map(this._DEV_renderServiceList)}
        <p>BACK TO <a href="/">UPLOADS</a></p>
        <br /><br />
        <button className="btn" onClick={this.testQuery}>Test Query</button>
        <br /><br />
        <br /><br />
        <button className="btn" onClick={this.testQuery2}>Test Query2</button>
        <br /><br />
      </div>
    )
  }
});
// <br /><br />
// <button className="btn" onClick={this.testTwitter}>Twitter Image</button>
// <br /><br />
// <button className="btn" onClick={this.loginTumblr}>Tumblr Auth</button>
// <br /><br />