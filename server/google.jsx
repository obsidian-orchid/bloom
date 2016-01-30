Meteor.methods({
  postPhoto(){
    //var googleID = Meteor.user().services.google.id;
    //var url = "https://www.googleapis.com/plus/v1/people/"+googleID;
    //var options = {
    //  'headers' : {
    //    'Content-Type': 'application/json',
    //    'Authorization': 'Bearer ' +  Meteor.user().services.google.accessToken,
    //    'X-JavaScript-User-Agent': "Google APIs Explorer"
    //  },
    //  'params' : {
    //    part : 'snippet',
    //    q : 'cats',
    //    maxResults : 25
    //  }
    //};
    //
    //var searchResult = HTTP.get(url, options);
    //console.log(searchResult);
    //return searchResult;
    var googleID = Meteor.user().services.google.id;
    var url = "https://www.googleapis.com/upload/plusDomains/v1/people/"+googleID+"/media/cloud";
    var options = {
      'headers' : {
        'Content-Type': 'image/jpeg',
        'Authorization': 'Bearer ' +  Meteor.user().services.google.accessToken,
        'X-JavaScript-User-Agent': "Google APIs Explorer",
        'url': "https://bloom-photos.s3-us-west-1.amazonaws.com/uLutxQYutGeGNiE4s/famous-cartoon-character-homer-simpson.jpg"
      }
    };

    var searchResult = HTTP.post(url, options);
    console.log(searchResult);
    return searchResult;
  }

});

/*
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