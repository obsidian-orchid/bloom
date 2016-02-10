// Accounts.oauth.registerService('twitter');

// Meteor.methods({
//   myLoginWithTwitter: function(options, callback) {
//     // support a callback without options
//     if (! callback && typeof options === "function") {
//       callback = options;
//       options = null;
//     }

//     var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
//     Twitter.requestCredential(options, credentialRequestCompleteCallback);
//   }
// });

var urls = {
  requestToken: "https://api.twitter.com/oauth/request_token",
  authorize: "https://api.twitter.com/oauth/authorize",
  accessToken: "https://api.twitter.com/oauth/access_token",
  authenticate: "https://api.twitter.com/oauth/authenticate?oauth_token="
}

var config = {
  service: 'twitter',
  consumerKey: Meteor.settings.TwitterClientKey,
  secret: Meteor.settings.TwitterSecret
}

var twitter = new OAuth_SS(1, urls, config);

Meteor.methods({
  twitterGetToken: function() {
    return twitter.generateRequestToken();
  },
  twitterAuthToken: function(params) {
    twitter.generateAccessToken(params);
  },//,
  // verifyAuth: function() {
  //   return twitter.verifyService();
  // }
  twitterPost: function(){
    console.log('twitter');
    twitter.post();
  }
});