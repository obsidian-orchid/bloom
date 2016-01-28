API = React.createClass({
	postFBPhoto(event) {
			event.preventDefault();
			console.log('event: ');
			Meteor.call('postFBPhoto', function(err, data) {
				// $('#result').text(JSON.stringify(data, undefined, 4));
				console.log('postFBPhoto res: ', data);
				// this.result = JSON.stringify(data, undefined, 4);
			});
		},
		login: function(event) {
			Meteor.loginWithFacebook({
				requestPermissions: ['user_photos', , 'user_videos', 'user_posts', 'publish_actions', 'public_profile']
			}, function(err) {
				if (err) {
					throw new Meteor.Error("Facebook login failed, " + err);
				}
				console.log('fb_login: ', event);
			});
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
			return ( < div >
				< button id = "logout"
				onClick = {
					this.logout
				} > Logout < /button> < button id = "facebook-login"
				onClick = {
					this.login
				} > Login with Facebook < /button>

				< form id = "upload"
				onSubmit = {
					this.postFBPhoto
				} >
				< pre id = "result" > {
					this.result
				} < /pre> < input type = "Submit" / >
				< /form> < /div >
			)
		}

});