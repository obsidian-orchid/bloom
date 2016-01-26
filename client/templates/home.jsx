var uploader = new Slingshot.Upload("myFileUploads");

Home = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      //returning alphabetically sorted services
      images: Images.find({}, {sort: {createdAt: -1}}).fetch(),
      currentUser: Meteor.user()
    };
  },

  //renderServices(){
  //  return this.data.services.map((service) => {
  //    return <Service key={service._id} service={service} />
  //  });
  //},

	uploadImage(event) {
		event.preventDefault();
		var urls = [];
		for (var i = 0; i < fileUpload.length; i++) {
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




