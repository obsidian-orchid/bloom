Images = new Mongo.Collection('images');

Images.schema = new SimpleSchema({
  url: {type: String}
});

Images.attachSchema(Images.schema);

Meteor.methods({

  uploadImage(urlInput){
    console.log(url);
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Images.insert({
      url: urlInput,
      createdAt: new Date()
    });
  }

});