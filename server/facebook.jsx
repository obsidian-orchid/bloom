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
    }
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
}

Facebook.prototype.getUserData = function() {
    return this.query('me');
}

Meteor.methods({
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
    }
});