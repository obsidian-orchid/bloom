Meteor.publish('services', function(){
	return Services.find({
		//'state': true
	});
 });

Meteor.publish('images', function(){
  return Images.find();
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
			'emails': 1,
			'profile': 1,
			'services': 1
	   }
	});
	} else {
		return this.ready();
	}
});

Meteor.methods({
  cameraPhoto: function(imageData){
    console.log('in server');

  },
  cameraPhonePhoto: function(imageUrl){
    console.log('in server from Phone', imageUrl);
  }
});

//allows us to add custom fields to users
Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};

  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;

  return user;
});

Accounts.config({
  sendVerificationEmail: true
});