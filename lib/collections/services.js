Services = new Mongo.Collection('services');

Meteor.methods({
  addService(text){
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Services.insert({
      name: text
    });
  },

  deleteService(serviceId){
    Services.remove(serviceId);
  }
});