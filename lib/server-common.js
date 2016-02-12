Meteor.serverCommon = {
  addCommonService: function(service, params) {
    var userId = Meteor.userId();
    
    var userServ = UserServices.findOne({'userId': userId});
    var serviceObj = userServ.services;

    serviceObj[service] = params;
    serviceObj[service].state = true;
    
    UserServices.update(
      {'userId': userId}, 
      {
        $set: {'services': serviceObj}
      },
      {
        upsert: true
      }
    );
    return serviceObj;

    // var userId = Meteor.userId();

    // var userServ = UserServices.findOne({'userId': userId});
    // console.log('userServ: ', userServ);
    // var servicesObj = userServ.services;

    // var tokenObj = {'accessToken': token};
    // var stateObj = {'state': true}

    // var query = {};
    // query.services = {};
    // query.services[service] = tokenObj;
    // query.services[service].state = stateObj;
    // // query['services.imgur.accessToken'] = token;
    // // query['services.imgur.state'] = true;
    // UserServices.update(
    //   {'userId': userId}, 
    //   {
    //     $set: query
    //   },
    //   {
    //     upsert: true
    //   }
    // );
    // return query;

    // var userId = Meteor.userId();

    // var serviceObj = {
    //   'name': service,
    //   'accessToken': token, 
    //   'state': true
    // }
    
    // UserServices.update(
    //   { 'userId': userId }, 
    //   { $push: {services: serviceObj} }
    // );
    // return serviceObj;
  },
}