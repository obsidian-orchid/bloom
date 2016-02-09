OAuth_SS = function(name, type, urls) {
  this.service = name;
  this.urls = urls;
  this.config = {
    service: 'twitter',
    consumerKey: 'hhsLUrt8nUrefjeDRuUTrwsQN',
    secret: '70F1khPQUT0FO2VnF1Q0YxiMnswjhRqD3lVGN0eMLM0KncOVaV'
  };
  this.requestToken = {};
  this.requestTokenSecret = {};
  this.accessToken = {};
  this.accessTokenSecret = {};
};

OAuth_SS.prototype.generateRequestToken = function() {
  var self = this;
  // Create OAUTH1 headers
  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  var headers = oauthBinding._buildHeader();
  // console.log('oa: ', oauthBinding);
  // console.log('hdr: ', headers);

  // Make request
  // oauthBinding._call('POST', self.urls.requestToken, headers, null, function(err, res) {
  //   console.log('res: ', res);
  //   var tokens = queryStringToJSON(res.content);

  //   if (! tokens.oauth_callback_confirmed) {
  //     throw 'Error: oauth_callback_confirmed false when requesting oauth1 token: ' + res;
  //   }

  //   self.requestToken = tokens.oauth_token;
  //   self.requestTokenSecret = tokens.oauth_token_secret;

  //   var redirectUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + self.requestToken;
  //   this.res.writeHead(302, {'Location': redirectUrl});
  //   this.res.end();
  //   return 'dude';
  // });

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
  console.log('code: ', params);

  var oauthBinding = new OAuth1Binding(self.config, self.urls);
  var headers = oauthBinding._buildHeader({
    oauth_token: params.oauth_token,
    oauth_verifier: params.oauth_verifier
  });
  // console.log('oa: ', oauthBinding);
  // console.log('hdr: ', headers);

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

  var query = {};
  query.userId = Meteor.userId();
  query.services = {};
  query.services[self.service] = { 
      accessToken: self.accessToken,
      accessTokenSecret: self.accessTokenSecret
  };
  UserServices.upsert({id: Meteor.userId}, {$set: query});
}

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