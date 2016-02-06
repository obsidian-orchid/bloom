Services = new Mongo.Collection('services');


// Seed service database with the currently supported services
//Meteor.startup(function () {
  //Meteor.call('removeAllServices');
  //for(key in supportedServices){
  //  Services.insert(supportedServices[key])
  //}

    //if (Services.find().count() == 0) {
    //    Services.insert({
    //      name: 'facebook',
    //      state: true
    //    });
    //    Services.insert({
    //      name: 'google',
    //      state: false
    //    });
    //    Services.insert({
    //      name: 'imgur',
    //      state: true
    //    });
    //    Services.insert({
    //      name: 'twitter',
    //      state: true
    //    });
    //    Services.insert({
    //      name: 'pinterest',
    //      state: true
    //    });
    //}
//});

// Meteor.methods({
//   addService(nameInput, urlInput){
//     console.log(nameInput);
//     if(!Meteor.userId()){
//       throw new Meteor.Error('not-authorized');
//     }

//     Services.insert({
//       name: nameInput,
//       status: statusInput,
//       token: loginInput
//     });
//   },

//   deleteService(name){
//     Services.remove(name);
//   }
// });