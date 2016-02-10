OAuth_SS = function(type, urls, config) {
  this.type = type;
  this.urls = urls;
  this.config = config;
  this.requestToken = {};
  this.requestTokenSecret = {};
  this.accessToken = {};
  this.accessTokenSecret = {};
};

OAuth_SS.prototype.clear = function() {
  var self = this;
  self.requestToken = {};
  self.requestTokenSecret = {};
  self.accessToken = {};
  self.accessTokenSecret = {};
}

OAuth_SS.prototype.generateRequestToken = function() {
  var self = this;
  // Create OAUTH1 headers
  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  var headers = oauthBinding._buildHeader();
  // console.log('oaRT: ', oauthBinding);
  console.log('hdrRT: ', headers);

  var response =  oauthBinding._call('POST', self.urls.requestToken, headers);
  var tokens = queryStringToJSON(response.content);
  // console.log('tokens: ', tokens);

  if (! tokens.oauth_callback_confirmed) {
    throw "Error: oauth_callback_confirmed false when requesting oauth1 token: " + response;
  }

  self.requestToken = tokens.oauth_token;
  self.requestTokenSecret = tokens.oauth_token_secret;
  
  return self.urls.authenticate + self.requestToken;
}

OAuth_SS.prototype.generateAccessToken = function(params) {
  var self = this;
  // console.log('code: ', params);

  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  var headers = oauthBinding._buildHeader({
    oauth_token: params.oauth_token,
    oauth_verifier: params.oauth_verifier
  });
  // console.log('oaAT: ', oauthBinding);
  console.log('hdrAT: ', headers);

  // http://localhost:3000/services/tumblr?oauth_token=jYPiybv97krPDyomPncRsOR70wv3hKKvTNonrGx38A9P9DsyFz&oauth_verifier=9YVZ7zIKLGSDCINA7SbOYJs1IcLBidabig02NdI4STFSW3EYe0#_=_
  // https://apigee.com/oauth_callback/tumblr/oauth1callback?oauth_token=QtZTwgEhfNsx9R0VeLqGIOf02OczzgI7KQXMewtnAsrVUVVBUs&oauth_verifier=L3DlS6gesi5iMFwvYhDPkoG95Aow0EpLHgOmKchv1KBe41HjqA#_=_

  var response = oauthBinding._call('POST', self.urls.accessToken, headers);
  var tokens = queryStringToJSON(response.content);
  // console.log('tokens: ', tokens);

  if (! tokens.oauth_token || ! tokens.oauth_token_secret) {
    var error = "Error: missing oauth token or secret";
    // We provide response only if no token is available, we do not want to leak any tokens
    if (! tokens.oauth_token && ! tokens.oauth_token_secret) {
      _.extend(error, {response: response});
    }
    throw error;
  }

  self.accessToken = tokens.oauth_token;
  self.accessTokenSecret = tokens.oauth_token_secret;

  console.log('token: ', self.accessToken);
  console.log('secret: ', self.accessTokenSecret);

  var query = {};
  query.userId = Meteor.userId();
  query.services = {};
  query.services[self.config.service] = { 
      accessToken: self.accessToken,
      accessTokenSecret: self.accessTokenSecret
  };
  // http://localhost:3000/services/twitter?oauth_token=iNlFEQAAAAAAkG43AAABUscgLJQ&oauth_verifier=IzzapmlO5SSiKp7U0sRq2HYUrEaPIoXJ
  UserServices.upsert({userId: Meteor.userId}, {$set: query});
};

OAuth_SS.prototype.post =  function(){
  //console.log('twitter');
  var self = this;
  self.accessToken = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessToken;
  self.accessTokenSecret = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessTokenSecret;
  console.log(self.config);
  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  oauthBinding.accessToken = self.accessToken;
  oauthBinding.accessTokenSecret = self.accessTokenSecret;

  var params = { status: 'test' };

  var result = oauthBinding.call('POST', 'https://api.twitter.com/1.1/statuses/update.json', params);
  console.log('result: ', result);
  //var headers = oauthBinding._buildHeader({
  //  accessToken: self.accessToken
  //});
  //console.log(headers);
  //var response =  oauthBinding._call('POST', "https://upload.twitter.com/1.1/media/upload.json?status=Maybe%20he%27ll%20finally%20find%20his%20keys.%20%23peterfalk", headers);
  //var tokens = queryStringToJSON(response.content);
  //console.log(tokens);

  //HTTP.post("https://api.twitter.com/1.1/statuses/update.json", {
  //  data: {image: url},
  //  headers: {
  //    Authorization: headers
  //  }
  //}, function (error, result) {
  //  if(error) {
  //    console.log(error);
  //  }
  //  else{
  //    console.log('result: ', result);
  //  }
  //})
};
function queryStringToJSON(str) {
  var pairs = str.split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    var name = pair[0]
    var value = pair[1]
    if (name.length)
      if (result[name] !== undefined) {
        if (!result[name].push) {
          result[name] = [result[name]];
        }
        result[name].push(value || '');
      } else {
        result[name] = value || '';
      }
  });
  return (result);
}

