var uploader = new Slingshot.Upload("myFileUploads");
imageDetails = new Mongo.Collection('imageDetails');
Home = React.createClass({

	mixins: [ReactMeteorData],

	getMeteorData(){
		return {
			images: imageDetails.find({}, {sort: {createdAt: -1}}).fetch(),
			currentUser: Meteor.user()
		};
	},

	renderImages(){
		return this.data.images.map((image) => {
			//console.log(image);
			return <Image key={image._id} image={image} />
		});
	},

  renderServices(){
    //if(this.data.currentUser !== undefined) {
      var services = Object.keys(this.data.currentUser.services);
      return services.map((image) => {
        return <li>{image}</li>
      });
    //}
  },

	uploadImage(event) {
		event.preventDefault();
		//console.log('test: ', document.getElementById('input').files);
		var fileUpload = document.getElementById('input').files;
		
		for (var i = 0; i < fileUpload.length; i++) {
			//https://bloom-photos.s3-us-west-1.amazonaws.com/DTEBgjvDQNLhZDvZx/792244_4741609493032_199570021_o.jpg
			var imageLocal = "https://bloom-photos.s3-us-west-1.amazonaws.com/"+this.data.currentUser._id+"/"+fileUpload[i].name;
			console.log(imageLocal);
			imageDetails._collection.insert({
				imageurl: imageLocal,
				time: new Date()
			});
			
			if (fileUpload[i] == null)
			{
				continue;
			}
			uploader.send(fileUpload[i], function (error, downloadUrl) {
				if (error)
				{
					console.error('Error uploading', uploader.xhr.response);
				}
				else
				{
					Meteor.call('postFBPhoto', downloadUrl);
					Meteor.call('postImgur', downloadUrl);
					allFilesUploaded(downloadUrl);
				}
			});
		}
		function allFilesUploaded (url) {
			Meteor.users.update(Meteor.userId(), {$push: {"profile.files": url}});
		}
	},
	render(){
		return (
      <div>
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              {this.renderServices()}
            </ul>
          </div>
        </div>
        <div className="row">
				  <form id="upload" className="col s12" onSubmit={this.uploadImage}>
					  <div className="row">
						  <p className="flow-text">CLICK HERE TO UPLOAD</p>
						  <input id="input" type="file" multiple/>
						  <button className="btn waves-effect waves-light" type="submit" name="action">POST
							<i className="mdi-content-send right"></i>
						  </button>
					  </div>
				  </form>
				  <ul>
					  {this.renderImages()}
				  </ul>
			  </div>
      </div>
		);
	}
});

Image = React.createClass({
	propTypes: {
		image: React.PropTypes.object.isRequired
	},
	render(){
    return (
			<div>
				<li>{this.props.image}</li>
			</div>
		);
	}

});