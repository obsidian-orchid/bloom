/**
 * Created by siobhan on 2016/02/05.
 */
function Pinterest(accessToken) {
  this.accessToken = accessToken;
  this.options = {
    timeout: 3000,
    pool: {maxSockets: Infinity},
    headers: {connection: "keep-alive"}
  };
}

//Facebook.prototype.query = function(query, method) {
//  var self = this;
//  var method = (typeof method === 'undefined') ? 'get' : method;
//  var data = Meteor.sync(function(done) {
//    self.fb[method](query, function(err, res) {
//        done(null, res);
//    });
//  });
//  return data.result;
//};
//
//Facebook.prototype.getUserData = function() {
//  return this.query('me');
//};

Meteor.methods({
  getPinterestAuthCodeURL: function(){
    return "https://api.pinterest.com/oauth/?response_type=code" +
      "&redirect_uri=https://localhost:3000/services" +
      "&client_id=" + Meteor.settings.PinterestClientId +
      "&scope=read_public,write_public" +
      ""
  },
  getPinterestAccessTokenURL: function(code){
    return "https://api.pinterest.com/v1/oauth/token?" +
      "grant_type=authorization_code" +
      "&client_id=" + Meteor.settings.PinterestClientId +
      "&client_secret=" + Meteor.settings.PinterestClientSecret +
      "&code=" + code;
  }
  //postFacebook: function(url) {
  //  FBGraph.setAccessToken(Meteor.user().services.facebook.accessToken);
  //  var fbUserId = Meteor.user().services.facebook.id;
  //
  //  var wallPost = {
  //    url: url
  //  };
  //
  //  FBGraph.post(fbUserId + "/photos", wallPost, function(err, res) {
  //    if (err) {
  //      console.log('Could not post on Facebook', err);
  //    } else {
  //      console.log('res: ', res);
  //    }
  //  });
  //}
});