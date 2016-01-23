Services = new Mongo.Collection('services');

Services.schema = new SimpleSchema({
  name: {type: String},
  url: {type: String, regEx: SimpleSchema.RegEx.Domain} //domain because facebook.com is okay
});

Services.attachSchema(Services.schema);

Meteor.methods({
  addService(nameInput, urlInput){
    console.log(nameInput);
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Services.insert({
      name: nameInput,
      url: urlInput

    });
  },

  deleteService(serviceId){
    Services.remove(serviceId);
  }
});