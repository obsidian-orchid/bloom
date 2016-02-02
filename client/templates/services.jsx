ServicesList = React.createClass({

  getInitialState : function() {
    return {
      services : {
        google : {
          name : 'Google',
          status: 'inactive',
          login: function() {
            Meteor.signInWithGoogle ({
              requestPermissions: ['https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/plus.me',
                'https://www.googleapis.com/auth/plus.media.upload',
                'https://www.googleapis.com/auth/plus.stream.write',
                'https://www.googleapis.com/auth/userinfo.profile']
            }, function (err, mergedUserId) {
              if (err) {
                console.log('error', err);
              }
              // mergedUsers is set if a merge occured
              if (mergedUserId) {
                console.log(mergedUserId, 'merged with', Meteor.userId());
                // Remove merged collection
                Meteor.call('removeMergedCollection', mergedUserId, function(err, result) {
                  if (err) {
                    console.log('error', err);
                  }
                });
              }
            })
          },
          post: function() {

          }
        },
        facebook : {
          name : 'Facebook',
          status: 'inactive',
          login: function() {
            Meteor.signInWithFacebook({
              requestPermissions: ['user_photos', 'user_videos', 'user_posts', 'publish_actions', 'public_profile']
            }, function(err, mergedUserId) {
              if (err) {
                throw new Meteor.Error("Facebook login failed, " + err);
              }
              // mergedUsers is set if a merge occured
              if (mergedUserId) {
                console.log(mergedUserId, 'merged with', Meteor.userId());
                // Remove merged collection
                Meteor.call('removeMergedCollection', mergedUserId, function(err, result) {
                  if (err) {
                    console.log('error', err);
                  }
                });
              }
            });
          },
          post: function() {
            var imageURL = 'https://i.ytimg.com/vi/ITxA_Z1vITY/hqdefault.jpg';
            Meteor.call('postFBPhoto', imageURL, function(err, data) {
            });
          }
        },
        imgur: {
          name: 'Imgur',
          status: 'inactive',
          login: function() {
            Meteor.call('buildImgurURL', function(err, result) {
              console.log('test: ', result);
              window.open(result);
            });
            
            // HTTP.call('GET', url, function(err, result){
            //     if (err) {
            //       console.log('error occurred..');
            //       console.log(err);
            //     }
            //     console.log(result);
            // })
          },
          post: function(){
            Imgur.upload({
              image:'https://bloom-photos.s3-us-west-1.amazonaws.com/uLutxQYutGeGNiE4s/famous-cartoon-character-homer-simpson.jpg',
              apiKey:'91bbbe67ad8b736'
            }, function (error, data) {
                if (error) {
                  throw error;
                } else {
                  console.log(data);
                }
              });
          }

        }
      }
    }
  },
  post : function(key)  {
    var service = this.state.services[key];
    service.post();
  },
  login: function(key) {
    console.log('key: ', key);
    var service = this.state.services[key];
    service.login();

  },
  logout : function(key) {
    var id = Meteor.userId();
    Meteor.call('removeService', id, key, function(err, data) {
      console.log('logged out of ', data)
    });
  },
  //curl -X POST -H "Authorization: Bearer 950a46d0c2b18a08339814074580381a2acae6d2" -F
  //"image=https://bloom-photos.s3-us-west-1.amazonaws.com/uLutxQYutGeGNiE4s/famous-cartoon-character-homer-simpson.jpg" https://api.imgur.com/3/upload
  imgurPost(){
    var queryString = location.hash.substring(1);
    console.log(queryString);

    Meteor.call('addImgur', 'imgur', queryString);
    HTTP.post("https://api.imgur.com/3/image", {
        data: {image: 'https://bloom-photos.s3-us-west-1.amazonaws.com/uLutxQYutGeGNiE4s/famous-cartoon-character-homer-simpson.jpg'},
        headers: {
          Authorization: "Bearer " + '950a46d0c2b18a08339814074580381a2acae6d2',
        }
      }, function (error, result) {
      if(error) {
        console.log(error);
      }
      else{
        console.log(result);
      }
    })
  },

  render() {
    return (
      <div>
        <AppServiceList services={this.state.services} login={this.login} logout={this.logout} post={this.post} />
      </div>
    )
  }
});

/*
 AppServiceList
 */
var AppServiceList = React.createClass({
  renderServiceList(key) {
    var details = this.props.services[key]
    return (
      <div key={key}>
        <p>{details.name}</p>
        <button className="btn" onClick={this.props.login.bind(null, key)}>Add {details.name}</button>
        <button className="btn" onClick={this.props.logout.bind(null, key)}>Remove {details.name}</button>
        <br /><br />
        <button className="btn" onClick={this.props.post.bind(null, key)}>{details.name} Test Post</button>
      </div>
    )
  },
  render : function() {
    return (
      <div>
        {Object.keys(this.props.services).map(this.renderServiceList)}
      </div>
    )
  }
});

//var ImgurService = React.createClass({
//  render(){
//    return(
//      <div>
//        <button className="btn" id="google-login" onClick={this.login}>Add Imgur</button>
//        <button className="btn" id="logout" onClick={ this.logout }>Remove Imgur</button>
//      </div>
//    )
//  }
//});