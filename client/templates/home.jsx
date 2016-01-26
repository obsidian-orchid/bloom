var uploader = new Slingshot.Upload("myFileUploads");

Home = React.createClass({
	uploadImage(event) {
		event.preventDefault();
    console.log('test: ', document.getElementById('input').files);
		var fileUpload = document.getElementById('input').files;
		var urls = [];
		for (var i = 0; i < fileUpload.length; i++) {
      console.log(fileUpload[i].name);
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
    </div>
	);
	}

});




