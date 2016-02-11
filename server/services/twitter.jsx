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
};

var config = {
  service: 'twitter',
  consumerKey: Meteor.settings.TwitterClientKey,
  secret: Meteor.settings.TwitterSecret
};

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
  post_twitter: function(image, tweet) {
    //var imageCache = [];
    //var eachImage = {'imageb64': image, 'tweet': tweet};
    //imageCache.push(eachImage);
    //console.log(imageCache);
    console.log("gets here");
    twitter.uploadImage(image, tweet, function(err, resp){
      if(err){
        console.log(err);
      }
      else{
        console.log('inside twitter: ' + resp);
        console.log('success');
      }
    });
    //for (var i = 0; i < imageCache.length; i++) {
    //  twitter.uploadImage(image, tweet, function (err, response) {
    //    if(response === true){
    //
    //    }
    //  });
    //}
    //function handlingImageAsync(imageList, n){
    //  if(n === 0){
    //    return;
    //  }
    //  else{
    //    twitter.uploadImage(imageList[0].imageb64, imageList[0].tweet, function(err, response){
    //      if(err){
    //        console.log(err);
    //      }
    //      else{
    //        handlingImageAsync(imageList, n--);
    //      }
    //    });
    //  }
    //
    //}
    //handlingImageAsync(imageCache, imageCache.length);
  }
});