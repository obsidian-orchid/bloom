ServicesList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    return {
      // images: imageDetails.find({}, {sort: {createdAt: -1}}).fetch(),
      currentUser: Meteor.user()
    };
  },
  getInitialState : function() {
    // console.log('user: ', this.data.currentUser);
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
            // var url = 'https://bloom-photos.s3-us-west-1.amazonaws.com/SJSDJe84KCExbGhHa/famous-cartoon-character-eric_theodore_cartman_southpark.jpg';
            Meteor.call('postImgur', url)
          },
          setToken: function() {
            var queryString = location.hash.substring(1);
            console.log(queryString);

            Meteor.call('addImgur', 'imgur', queryString);
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
        Authorization: "Bearer " + '950a46d0c2b18a08339814074580381a2acae6d2'
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
        <AppServiceList services={this.state.services} login={this.login} logout={this.logout} post={this.post} activeServices={Object.keys(this.data.currentUser.services)} />
      </div>
    )
  }
});

/*
 AppServiceList
 */
var AppServiceList = React.createClass({
  renderServiceList(key) {
    var details = this.props.services[key];
    var active = this.props.activeServices;
    // console.log('active: ', active);

    if(active.indexOf(key) !== -1) {
      return (
        <div key={key}>
          <button className="btn" onClick={this.props.logout.bind(null, key)}>Remove {details.name}</button>
          <br /><br />
        </div>
      )
    }
    return (
      <div key={key}>
        <button className="btn" onClick={this.props.login.bind(null, key)}>Add {details.name}</button>
        <br /><br />
      </div>
    )
  },
  render : function() {
    return (
      <div>
        {Object.keys(this.props.services).map(this.renderServiceList)}
        <br /><br />
        <button className="btn" onClick={this.props.services.imgur.setToken}>Set Imgur Token</button>
      </div>
    )
  }
});



/*
  Order
  <Order/>
*/
var Order = React.createClass({
  renderOrder : function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null,key)}>&times;</button>

    if(!fish) {
      return <li key={key}>Sorry, fish no longer available! {removeButton}</li>
    }

    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup component="span" transitionName="count" transitionLeaveTimeout={250} transitionEnterTimeout={250} className="count">
            <span key={count}>{count}</span>
          </CSSTransitionGroup>

          lbs {fish.name} {removeButton}
        </span>
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>)
  },
  render : function() {
    var orderIds = Object.keys(this.props.order);
    
    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        
        <CSSTransitionGroup
              className="order"
              component="ul"
              transitionName="order"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>

      </div>
    )
  }
})
