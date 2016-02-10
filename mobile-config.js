/**
 * Created by siobhan on 2016/02/09.
 */
// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.example.matt.uber',
  name: 'SnapShare',
  description: 'Share all the things!',
  author: 'Obsidian Orchid',
  email: 'obsidian.orchid.bloom@gmail.com',
  website: 'https://snapshare.meteor.com'
});

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'favicon.png',
  'android': 'favicon.png'
  // ... more screen sizes and platforms ...
});

App.accessRule("*");

//// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', '0xff0000ff');
//App.setPreference('HideKeyboardFormAccessoryBar', true);
//
//// Pass preferences for a particular PhoneGap/Cordova plugin
//App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//  APP_ID: '1234567890',
//  API_KEY: 'supersecretapikey'
//});