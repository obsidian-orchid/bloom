Services = new Mongo.Collection('services');

// Seed service database with the currently supported services
Meteor.startup(function () {
    if (Services.find().count() == 0) {
        Services.insert({
          name: 'Facebook', 
          state: true
        });
        Services.insert({
          name: 'Google', 
          state: false
        });
        Services.insert({
          name: 'Imgur', 
          state: true
        });
        Services.insert({
          name: 'Tumblr',
          state: true
        });

    }
});

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