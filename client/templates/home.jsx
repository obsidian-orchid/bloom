var uploader = new Slingshot.Upload("myFileUploads");

Home = React.createClass({

	uploadImage(event) {
		event.preventDefault();
		
		// console.log('test: ', document.getElementById('input').files[0]);
		var fileUpload = document.getElementById('input').files[0];
		
		uploader.send(fileUpload, function (error, downloadUrl) {
		  if (error) {
		    // Log service detailed response.
		    console.error('Error uploading', uploader.xhr.response);
		    alert (error);
		  }
		  else {
		  	console.log('sucessful upload!', downloadUrl);
		    Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
		  }
		})

	},
	render(){
	return (
		<div className="upload-area">
			<form id="upload" onSubmit={this.uploadImage}>
			<p className="alert alert-success text-center">
				<span>Click or Drag a File Here to Upload</span>
				<input id="input" type="file" />
				<input type="Submit" />
			</p>
			</form>
		</div>				
	);
	}

});




