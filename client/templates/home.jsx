var uploader = new Slingshot.Upload("myFileUploads");

Home = React.createClass({

	uploadImage(event) {
		event.preventDefault();
		
		 console.log('test: ', document.getElementById('input').files[0]);
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
		});

		//var inputs = document.getElementsByTagName('input');
		//var urls = [];
		//for (var i = 0; i < inputs.length; i++) {
		//	if (inputs[i].files == null) { continue; }
		//	uploader.send(inputs[i].files[0], function (error, downloadUrl) {
		//		if (error) {
		//			console.error('Error uploading', uploader.xhr.response);
		//		} else {
		//			urls.push(downloadUrl);
		//			if (urls.length > inputs.length - 1)
		//				allFilesUploaded();
		//		}
		//	});
		//}
		//function allFilesUploaded () {
		//	Meteor.users.update(Meteor.userId(), {$push: {"profile.files": urls}});
		//	console.log('All done!');
		//}
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
		</div>				
	);
	}

});




