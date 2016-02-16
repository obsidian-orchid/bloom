/**
 * Created by siobhan on 2016/02/05.
 */

Meteor.methods({
    pinterestAuthToken: function(params){
      var code = params.code;

      HTTP.post("https://api.pinterest.com/v1/oauth/token", {
        data: {
          client_id: Meteor.settings.PinterestClientId,
          client_secret: Meteor.settings.PinterestClientSecret,
          grant_type: "authorization_code",
          code: code
        }
      }, function (error, result) {
        if(error) {
          console.log(error);
        }
        else{
          console.log('result: ', result.data);
          query = {};
          query['services.pinterest.accessToken'] = result.data.access_token;
          Meteor.users.update(Meteor.userId(), {$set: query});
        }
      });
    },
    pinterestAuthLink: function() {
      return "https://api.pinterest.com/oauth/?response_type=code" +
      "&redirect_uri=https://snapshare.meteor.com/services/pinterest" +
      "&client_id=" + Meteor.settings.PinterestClientId +
      "&scope=read_public,write_public";

      //return "https://api.pinterest.com/oauth/?response_type=code" +
      //"&redirect_uri=https://localhost:3000/services/pinterest" +
      //"&client_id=" + Meteor.settings.PinterestClientId +
      //"&scope=read_public,write_public";
    },
    post_pinterest: function(url) {
      console.log("posting to pinterest");
      var imageId, link;
      var access_token = Meteor.user().services.pinterest.accessToken;
      HTTP.post("https://api.pinterest.com/v1/pins/", {
        data: {
          board: "obsidiano/snapshare",
          note: "Shared with SnapShare",
          image_base64: url
        },
        headers: {
          Authorization: "Bearer " + access_token
        }
      }, function (error, result) {
        if(error) {
          console.log(error);
        }
        else{
          console.log('result: ', result);
          imageId = result.data.data.id;
          link = result.data.data.url;
          //console.log(imageId);
          Images.insert({
            url: url,
            imageId: imageId,
            link: link
          })
        }
      })
    }

  //  delete_pinterest: function(url){
  //    var access_token = Meteor.user().services.imgur.accessToken;
  //    //console.log(url);
  //    var imageId = Images.findOne({ url: url }).imageId;
  //    //console.log(imageId);
  //    HTTP.del("https://api.imgur.com/3/image/"+imageId,{
  //      headers: {
  //        Authorization: "Bearer " + access_token
  //      }
  //    }, function (error, result) {
  //      if(error) {
  //        console.log(error);
  //      }
  //      else {
  //        //console.log(result);
  //        Images.remove({imageId: imageId});
  //      }
  //    })
  //  }
});