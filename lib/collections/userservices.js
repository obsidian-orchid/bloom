UserServices = new Mongo.Collection('userservices');

// UserServices.schema = new SimpleSchema({
//   userId: {type: objectId},
//   services: {
//     name: {type: String},
//     status: {type: String},
//     token: {type: String}  
//   }
// });
// UserServices.attachSchema(UserServices.schema);

// // Seed service database with an example service
// // Meteor.startup(function () {
// //     if (UserServices.find().count() == 0) {
// //         UserServices.insert({
// //           userId: 1,
// //           services: {
// //             name: 'SuperSocialNetwork',
// //             state: false
// //           }
// //         });
// //     }
// // });

// Meteor.methods({
//   addService(userIdInput, nameInput, statusInput, tokenInput){
//     console.log(nameInput);
//     if(!Meteor.userId()){
//       throw new Meteor.Error('not-authorized');
//     }

//     UserServices.insert({
//       name: nameInput,
//       status: statusInput,
//       token: toeknInput
//     });
//   },

//   deleteService(name){
//     UserServices.remove(name);
//   }
// });