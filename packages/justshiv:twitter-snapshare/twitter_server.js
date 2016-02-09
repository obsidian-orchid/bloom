TwitterSS = {};

var urls = {
  requestToken: "https://api.twitter.com/oauth/request_token",
  authenticate: "https://api.twitter.com/oauth/authenticate",
  accessToken: "https://api.twitter.com/oauth/access_token",
  authorize: "https://api.twitter.com/oauth/authorize"
};


// https://dev.twitter.com/docs/api/1.1/get/account/verify_credentials
TwitterSS.whitelistedFields = ['profile_image_url', 'profile_image_url_https', 'lang'];

OAuth.registerService('twitter', 1, urls, function(oauthBinding) {
  console.log('oauthBinding: ', oauthBinding)
  var identity = oauthBinding.get('https://api.twitter.com/1.1/account/verify_credentials.json').data;

  console.log("id: ", identity);

  var serviceData = {
    id: identity.id_str,
    screenName: identity.screen_name,
    accessToken: OAuth.sealSecret(oauthBinding.accessToken),
    accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret)
  };

  // include helpful fields from twitter
  var fields = _.pick(identity, TwitterSS.whitelistedFields);
  _.extend(serviceData, fields);

  var genReturn = {
    serviceData: serviceData,
    options: {
      profile: {
        name: identity.name
      }
    }
  };

  console.log('genReturn: ', genReturn);
  return genReturn;
});


TwitterSS.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

// {
//   _config: {
//     _id: 'bHhYhjPsjoM9wmi4e',
//     service: 'twitter',
//     consumerKey: 'hhsLUrt8nUrefjeDRuUTrwsQN',
//     secret: '70F1khPQUT0FO2VnF1Q0YxiMnswjhRqD3lVGN0eMLM0KncOVaV'
//   },
//   _urls: {
//     requestToken: 'https://api.twitter.com/oauth/request_token',
//     authorize: 'https://api.twitter.com/oauth/authorize',
//     accessToken: 'https://api.twitter.com/oauth/access_token',
//     authenticate: 'https://api.twitter.com/oauth/authenticate'
//   },
//   accessTokenSecret: '6f4isYrvxfLhby5RTVEF7gKMS0f6AFsoLGCRRoexzk5PX',
//   accessToken: '4831581596-Ur1UIuuw0qdAFmTWIYdVQGm64h6sNPVg5p29BZV'
// }

// serviceData: {
//   id: '4831581596',
//   screenName: 'orchidisinbloom',
//   accessToken: '4831581596-Ur1UIuuw0qdAFmTWIYdVQGm64h6sNPVg5p29BZV',
//   accessTokenSecret: '6f4isYrvxfLhby5RTVEF7gKMS0f6AFsoLGCRRoexzk5PX',
//   profile_image_url: 'http://pbs.twimg.com/profile_images/693151301580955648/8-x57Rd9_normal.png',
//   profile_image_url_https: 'https://pbs.twimg.com/profile_images/693151301580955648/8-x57Rd9_normal.png',
//   lang: 'en'
// },
// options: {
//   profile: {
//     name: 'Bloom'
//   }
// }
