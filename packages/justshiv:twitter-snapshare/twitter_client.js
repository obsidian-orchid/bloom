TwitterSS = {};

// Request Twitter credentials for the user
// @param options {optional}  XXX support options.requestPermissions
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
TwitterSS.requestCredential = function (options, credentialRequestCompleteCallback) {
  console.log('here!');
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'twitter'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();
  // We need to keep credentialToken across the next two 'steps' so we're adding
  // a credentialToken parameter to the url and the callback url that we'll be returned
  // to by oauth provider

  var loginStyle = OAuth._loginStyle('twitter', config, options);

  // url to app, enters "step 1" as described in/
  // packages/accounts-oauth1-helper/oauth1_server.js

  console.log('token: ', credentialToken);
  console.log('opt: ', options);
  console.log('red: ', options.redirectUrl);
  var loginPath = '_oauth/twitter/?requestTokenAndRedirect=true' + '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

  if (Meteor.isCordova) {
    loginPath = loginPath + "&cordova=true";
    if (/Android/i.test(navigator.userAgent)) {
      loginPath = loginPath + "&android=true";
    }
  }

  var loginUrl = Meteor.absoluteUrl(loginPath);

  var options = {
    loginService: "twitter",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  }
  console.log('options: ', options);

// loginService: "twitter"
// loginStyle: "popup"
// loginUrl: "http://localhost:3000/_oauth/twitter/?requestTokenAndRedirect=true&state=eyJsb2dpblN0eWxlIjoicG9wdXAiLCJjcmVkZW50aWFsVG9rZW4iOiJtd0pxWEJUNFJ0WXNkWGVONG1KVkQycWY1eVFybm82T2RiVmFWT0VQa21ZIiwiaXNDb3Jkb3ZhIjpmYWxzZX0="
// credentialRequestCompleteCallback: (credentialTokenOrError)
// credentialToken: "mwJqXBT4RtYsdXeN4mJVD2qf5yQrno6OdbVaVOEPkmY"

// https://api.twitter.com/oauth/authenticate?oauth_token=yX4F9gAAAAAAkG43AAABUsMrrj4

  OAuth.launchLogin(options);
};