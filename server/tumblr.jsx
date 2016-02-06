Meteor.methods({
  LogToTumblr(){
    console.log('Tumblr');
    //var test = "https://www.tumblr.com/oauth/authorize?oauth_token="+Meteor.settings.tumblrToken;
    var test = "https://www.tumblr.com/oauth/request_token="+Meteor.settings.tumblrToken;
    console.log('test server: ', test);
    return test;
  }
});