var urls = {
  requestToken: "https://api.tumblr.com/oauth/request_token",
  authorize: "https://api.tumblr.com/oauth/authorize",
  accessToken: "https://api.tumblr.com/oauth/access_token",
  authenticate: "https://api.tumblr.com/oauth/authenticate"
};

Meteor.methods({
  LogToTumblr(){
    console.log('Tumblr');
    ////var test = "https://www.tumblr.com/oauth/authorize?oauth_token="+Meteor.settings.tumblrToken;
    ////console.log('test server: ', test);
    ////return test;
    //HTTP.post("")
  }
});
