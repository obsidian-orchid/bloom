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
		console.log(this.data.images);
		return this.data.images.map((image) => {
			//console.log(image);
			return <Image key={image._id} image={image} />
		});
	},

  renderServices(){
    var resultArray = [];
    Meteor.call('EnabledServices', function(err, result){
      if(err){
        console.log(err);
      }
      console.log(result);
      for(var key in result){
        console.log(key);
        if(result[key].token !== undefined){
          resultArray.push(key);
        }
        else if(result[key].accessToken !== undefined){
          resultArray.push(key);
        }
      }
      return resultArray;
    })
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
        {this.renderServices().map(this)}
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

EachServices = React.createClass({
  render(){
    return (
      <div>
          {this.props.list.map( ( service, index ) => {
            return <p key={ `service-${ index }` }>{ service }</p>;
          })}
      </div>
    )
  }
});

Image = React.createClass({

	propTypes: {
		image: React.PropTypes.object.isRequired
	},
	render(){
    console.log('Here')
    return (
			<div className="thumbnail">
				<li>
					<img src={this.props.image.imageurl} className="portrait" alt="Image"/>
				</li>
			</div>
		);
	}

});