API = React.createClass({
    postFBPhoto() {
        Meteor.call('postFBPhoto', function(err, data) {
            console.log('postFBPhoto res: ', data)
        });
    },
    login: function() {
        Meteor.signInWithFacebook({
            requestPermissions: ['user_photos', , 'user_videos', 'user_posts', 'publish_actions', 'public_profile']
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
                        console.log('error', error);
                    }
                });
            }
        });
        // Meteor.loginWithFacebook({
        // 	requestPermissions: ['user_photos', , 'user_videos', 'user_posts', 'publish_actions', 'public_profile']
        // }, function(err) {
        // 	if (err) {
        // 		throw new Meteor.Error("Facebook login failed, " + err);
        // 	}
        // 	console.log('fb_login: ', event);
        // });
    },
    logout: function(event) {
        Meteor.logout(function(err) {
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
            console.log('fb_logout: ', event);
        })
    },
    render() {
        return ( 
            <div>
                <button id="facebook-login" onClick={ this.login }>Add Facebook</button>
                <button id="logout" onClick={ this.logout }>Remove Facebook</button>
                <p>Test Photo Post</p>
                <button id="post-photo" onClick={ this.postFBPhoto }>Post a photo</button>
            </div>
        )
    }
});