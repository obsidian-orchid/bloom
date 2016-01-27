var uploader = new Slingshot.Upload("myFileUploads");

Home = React.createClass({

	mixins: [ReactMeteorData],

	getMeteorData(){
		return {
			//returning alphabetically sorted services
			images: imageDetails.find({}, {sort: {createdAt: -1}}).fetch(),
			currentUser: Meteor.user()
		};
	},

	renderImages(){
		//console.log(this.data.images);
		return this.data.images.map((image) => {
			//console.log(image);
			return <Image key={image._id} image={image} />
		});
	},
	uploadImage(event) {
		event.preventDefault();
		//console.log('test: ', document.getElementById('input').files);
		var fileUpload = document.getElementById('input').files;
		var urls = [];
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
					urls.push(downloadUrl);
					if (urls.length > fileUpload.length - 1) {
						allFilesUploaded();
					}
				}
			});
		}
		function allFilesUploaded () {
			Meteor.users.update(Meteor.userId(), {$push: {"profile.files": urls}});
			console.log('All done!');
		}
	},
	render(){
		return (
			<div className="upload-area">
				<form id="upload" onSubmit={this.uploadImage}>
					<p className="alert alert-success text-center">
						<span>Click or Drag a File Here to Upload</span>
						<input id="input" type="file" multiple/>
						<input type="Submit" />
					</p>
				</form>
				<strong>IMAGES UPLOADED</strong>
				<ul>
					{this.renderImages()}
				</ul>
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
			<li>
				<img src={this.props.image.imageurl}/>
			</li>
		);
	}

});