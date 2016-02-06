Meteor.methods({
  toggleServiceCommon(service, opt) {
    // console.log('service: ', service);
    var user = Meteor.users.findOne({_id: this.userId});

    var query = {};
    query['services.'+ service + '.state'] = opt;
    Meteor.users.update(Meteor.userId(), {$set: query});
    return 'set ' + service + ' ' + opt;
  },

  addCommonService: function(service, token) {
    query = {};
    var arrStr = token.split(/[=&]/);
    console.log('arrStr: ', arrStr[1]);
    // query['services.'+service] = '';
    query['services.'+ service + '.accessToken'] = arrStr[1];
    Meteor.users.update(Meteor.userId(), {$set: query});
    var access_token = Meteor.user().services.Imgur.accessToken;
    return access_token;
  },

  removeMergedCollection: function (mergedUserId) {
    console.log('Merging DB items of user', mergedUserId, 'with user', Meteor.userId());
    Meteor.users.remove(mergedUserId);
  },
  removeService: function (userId, service) {
    query = {};
    query['services.' + service] = {};
    Meteor.users.update(Meteor.userId(), {$set: query}, function(err, result) {
      return result;
    });
  }
});