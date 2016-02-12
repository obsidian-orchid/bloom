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
  // console.log('hdrRT: ', headers);

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
  // console.log('hdrAT: ', headers);

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

  // console.log('token: ', self.accessToken);
  // console.log('secret: ', self.accessTokenSecret);

  var params = { 
    accessToken: self.accessToken,
    accessTokenSecret: self.accessTokenSecret
  }
  // Meteor.serverCommon.addCommonService('twitter', params);

  var userId = Meteor.userId(); 
  var userServ = UserServices.findOne({'userId': userId});
  var serviceObj = userServ.services;

  serviceObj[self.config.service] = params;
  serviceObj[self.config.service].state = true;
  
  UserServices.update(
    {'userId': userId}, 
    {
      $set: {'services': serviceObj}
    },
    {
      upsert: true
    }
  );
};

OAuth_SS.prototype.post =  function(tweet){
  var self = this;

  tweet = tweet || '';
  self.accessToken = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessToken;
  self.accessTokenSecret = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessTokenSecret;
  console.log(self.config);
  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  oauthBinding.accessToken = self.accessToken;
  oauthBinding.accessTokenSecret = self.accessTokenSecret;

  var params = { status: tweet };

  var result = oauthBinding.call('POST', 'https://api.twitter.com/1.1/statuses/update.json', params);
  console.log('result: ', result);
  return 'successful post';
};

OAuth_SS.prototype.uploadImage =  function(image, tweet){
  var self = this;

  tweet = tweet || '';
  self.accessToken = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessToken;
  self.accessTokenSecret = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessTokenSecret;
  console.log(self.config);
  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  oauthBinding.accessToken = self.accessToken;
  oauthBinding.accessTokenSecret = self.accessTokenSecret;

  var params = { 
    media_data: image
  };
  
  return oauthBinding.call('POST', 'https://upload.twitter.com/1.1/media/upload.json', params, function(err, result) {
    // console.log('result image: ', result);

    params = { 
      status: tweet,
      media_ids: result.data.media_id_string
    }
    // console.log('params: ', params);
    var res = oauthBinding.call('POST', 'https://api.twitter.com/1.1/statuses/update.json', params);
    console.log('result tweet: ', res);
  
    return 'successful post';
  });
};
OAuth_SS.prototype.deleteImage = function(imageId, cb){
  var self = this;
  self.accessToken = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessToken;
  self.accessTokenSecret = UserServices.findOne({userId: Meteor.userId()}).services.twitter.accessTokenSecret;
  //console.log(self.config);
  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  oauthBinding.accessToken = self.accessToken;
  oauthBinding.accessTokenSecret = self.accessTokenSecret;

  return oauthBinding.call('POST', 'https://api.twitter.com/1.1/statuses/destroy/'+imageId+'.json', function(err, result) {
    // console.log('result image: ', result);
    if(err){
      console.log(err);
    }
    else {
        cb(err, result);
      }
  });
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