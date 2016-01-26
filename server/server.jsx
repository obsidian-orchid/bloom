Slingshot.fileRestrictions("myFileUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});

Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
	bucket: "bloom-photos",
	region: "us-west-1",
	AWSAccessKeyId: Meteor.settings.AWSAccessKeyId,
  	AWSSecretAccessKey: Meteor.settings.AWSSecretAccessKey,
	acl: "public-read",

	authorize: function () {
	//Deny uploads if user is not logged in.
	if (!this.userId) {
		var message = "Please login before posting files";
		throw new Meteor.Error("Login Required", message);
	}

	return true;
	},

	key: function (file) {
		//Store file into a directory by the user's username.
		var user = Meteor.users.findOne(this.userId);
		return user._id + "/" + file.name;
	}
}); 

 Meteor.publish('services', function(){
    return Services.find();
 });

//sending the correct user data to the client depending on who is logged in
Meteor.publish('userData', function() {
     var currentUser;
     currentUser = this.userId;
     if (currentUser) {
         return Meteor.users.find({
             _id: currentUser
         }, {
         fields: {
             // Default
             'emails': 1,
             // Created profile property
             'profile': 1,
             // Created roles property
             //'roles': 1
         }
      });
    } else {
      return this.ready();
  }
});

//allows us to add custom fields to users
Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};

  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;

  return user;
});


