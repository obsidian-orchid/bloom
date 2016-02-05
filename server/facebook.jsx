function Facebook(accessToken) {
    console.log('token: ', accessToken);
    // this.fb = Meteor.require('fbgraph');
    this.fb = FBGraph;
    this.accessToken = accessToken;
    this.fb.setAccessToken(this.accessToken);
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    };
    this.fb.setOptions(this.options);
}

Facebook.prototype.query = function(query, method) {
    var self = this;
    var method = (typeof method === 'undefined') ? 'get' : method;
    var data = Meteor.sync(function(done) {
        self.fb[method](query, function(err, res) {
            done(null, res);
        });
    });
    return data.result;
};

Facebook.prototype.getUserData = function() {
    return this.query('me');
};

Meteor.methods({
    addImgur: function(service, token) {
      query = {};
      var arrStr = token.split(/[=&]/);
      console.log('arrStr: ', arrStr[1]);
      // query['services.'+service] = '';
      query['services.'+ service + '.accessToken'] = arrStr[1];
      Meteor.users.update(Meteor.userId(), {$set: query});
      var access_token = Meteor.user().services.imgur.accessToken;
      return access_token;
    },
    buildImgurURL: function() {
      var test = "https://api.imgur.com/oauth2/authorize?client_id="+Meteor.settings.ImgurClientId+"&response_type=token";
      console.log('test server: ', test);
      return test;
    },
    postImgur: function(url) {
      var imageId, link;
      var access_token = Meteor.user().services.imgur.accessToken;
      HTTP.post("https://api.imgur.com/3/image", {
        data: {image: url},
        headers: {
          Authorization: "Bearer " + access_token
        }
      }, function (error, result) {
        if(error) {
          console.log(error);
        }
        else{
          //console.log(result);
          imageId = result.data.data.id;
          link = result.data.data.link;
          //console.log(imageId);
          Images.insert({
            url: url,
            imageId: imageId,
            link: link
          })
        }
      })
    },
   deleteImgur: function(url){
      var access_token = Meteor.user().services.imgur.accessToken;
      //console.log(url);
      var imageId = Images.findOne({ url: url }).imageId;
      //console.log(imageId);
      HTTP.del("https://api.imgur.com/3/image/"+imageId,{
        headers: {
          Authorization: "Bearer " + access_token
        }
      }, function (error, result) {
        if(error) {
          console.log(error);
        }
        else {
          //console.log(result);
          Images.remove({imageId: imageId});
        }
      })
    },
    postGoogle: function(url){
      var access_token = Meteor.user().services.google.accessToken;
      //console.log(access_token);
      var googleID = Meteor.user().services.google.id;
      var xmlData = '<?xml version="1.0" encoding="utf-8"?>' +
        '<atom:entry xmlns="http://www.w3.org/2005/Atom"'+
        'xmlns:media="http://search.yahoo.com/mrss/"'+
        'xmlns:gphoto="http://schemas.google.com/photos/2007">'+
        '<title type="text">Trip To Italy</title>'+
        '<summary type="text">This was the recent trip I took to Italy.</summary>'+
        '<gphoto:location>Italy</gphoto:location>'+
        '<gphoto:access>public</gphoto:access>'+
        '<gphoto:timestamp>1152255600000</gphoto:timestamp>'+
        '<media:group>'+
        '<media:keywords>italy, vacation</media:keywords>'+
        '</media:group>'+
        '<category scheme="http://schemas.google.com/g/2005#kind"'+
        'term="http://schemas.google.com/photos/2007#album"></category>'+
        '<atom:/entry>';
      console.log(xmlData);
      HTTP.post("https://picasaweb.google.com/data/feed/api/user/"+googleID, {
        headers:{
          'Content-Type': 'application/atom+xml',
          'Authorization': 'Bearer ' + access_token,
          'X-JavaScript-User-Agent': "Google APIs Explorer"
        },
        params: xmlData
      }, function (err, result) {
        if (err) {
          console.log('error occurred..');
          console.log(err);
          return;
        }
        console.log(result);
      });

    },
    postFBPhoto: function(url) {
        console.log('here: ', url);
        FBGraph.setAccessToken(Meteor.user().services.facebook.accessToken);
        var fbUserId = Meteor.user().services.facebook.id;

        var wallPost = {
            url: url
        };

        FBGraph.post(fbUserId + "/photos", wallPost, function(err, res) {
            if (err) {
                console.log('Could not post on Facebook', err);
            } else {
                // returns the post id
                console.log('res: ', res); // { id: xxxxx}
            }
        });
    },
    removeMergedCollection: function (mergedUserId) {
        console.log('Merging DB items of user', mergedUserId, 'with user', Meteor.userId());
        Meteor.users.remove(mergedUserId);
    },
    removeService: function (userId, service) {
        console.log('removeService', userId + ' : ' + service);
        
        query = {};
        query['services.'+service] = {};
        Meteor.users.update(Meteor.userId(), {$set: query});
        return service;
    }
});