UserServices = new Mongo.Collection('userservices');

// Meteor.startup(function () {
// 	var userId = this.userId;
// 	console.log('id: ', userId);
// 	var query = {};
// 	query.userId = userId;
// 	query.services = {};
// 	UserServices.upsert({userId: userId}, {$set: query});
// });

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