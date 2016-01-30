Meteor.methods({
  //making successful picasa api calls
  postPhoto(){
    var googleID = Meteor.user().services.google.id;
    var url = "https://picasaweb.google.com/data/feed/api/user/" + googleID;
    var options = {
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Meteor.user().services.google.accessToken,
        'X-JavaScript-User-Agent': "Google APIs Explorer"
      }
    };

    var albums = HTTP.get(url, options);
    console.log(albums);
    return albums;
  }
    //var searchResult = HTTP.get(url, options);
    //console.log(searchResult);
    //return searchResult;
    //var albumID;
    //var url = "https://picasaweb.google.com/data/feed/api/user/"+googleID+"/albumid/"+albumID;
    //var options = {
    //  'headers' : {
    //    'Authorization': 'Bearer ' +  Meteor.user().services.google.accessToken,
    //    'X-JavaScript-User-Agent': "Google APIs Explorer",
    //    url: url
    //  }
    //};
    //var searchResult = HTTP.get(url, function(err, data){
    //  if(err){
    //    console.log(err);
    //  }
    //  else{
    //    return searchResult;
    //  }
    //});
  //  var searchResult = HTTP.post(url, options);
  //  console.log(searchResult);
  //  return searchResult;
  //}

});

/*DOES NOT WORK
POST https://www.googleapis.com/upload/plusDomains/v1/people/{userid}/media/cloud

 $ curl --header "Authorization: OAuth $ACCESS_TOKEN" --header "Content-Type: image/jpeg"
 --data-binary "@cat.jpg" -X POST https://www.googleapis.com/upload/plusDomains/v1/people/<user_id>/media/cloud

 Use the returned media id
 curl -v -H "Content-Type: application/json" -H "Authorization: OAuth$ACCESS_TOKEN" -d "{"object":{"content":"Grumpy cat.... #mondays
  #caturday","attachments":[{"objectType" : "photo","id" : "0123456789.9876543210",}]},"access":{"items":[{"type": "domain"}],
  "domainRestricted":true}}"
 -X POST https://www.googleapis.com/plusDomains/v1/people/{user_id}/activities
POST https://www.googleapis.com/plusDomains/v1/people/{userid}/activities
  */

//https://picasaweb.google.com/data/feed/api/user/userID : get all albums
//POST https://picasaweb.google.com/data/feed/api/user/userID: to create an album
//https://picasaweb.google.com/data/feed/api/user/105279725066732142030/albumid/5642980865994614577
//https://bloom-photos.s3-us-west-1.amazonaws.com/uLutxQYutGeGNiE4s/famous-cartoon-character-homer-simpson.jpg
//request body: url: 'https://bloom-photos.s3-us-west-1.amazonaws.com/uLutxQYutGeGNiE4s/famous-cartoon-character-homer-simpson.jpg'


