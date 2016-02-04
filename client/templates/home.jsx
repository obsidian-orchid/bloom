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
			return <Image key={image._id} image={image} />
		});
	},

  renderServices(){
    if(this.data.currentUser !== undefined) {
      var services = [];
      for(var key in this.data.currentUser.services) {
        console.log(key, this.data.currentUser.services[key].hasOwnProperty('accessToken'));
        if(this.data.currentUser.services[key].hasOwnProperty('accessToken')){
          services.push(key);
        }
      }
      console.log(services);
      return services.map((service) => {
        return <EnabledServices key={service} service={service} />;
      });
    }
  },

	uploadImage(event) {
		event.preventDefault();
		//console.log('test: ', document.getElementById('input').files);
		var fileUpload = document.getElementById('input').files;

		for (var i = 0; i < fileUpload.length; i++) {
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
					//Meteor.call('postFBPhoto', downloadUrl);
					//Meteor.call('postImgur', downloadUrl);
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
      <div className="">
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              {this.renderServices()}
            </ul>
          </div>
        </div>
        <div className="row">
				  <form id="upload" className="col s12" onSubmit={this.uploadImage}>
            <p className="flow-text">CLICK HERE TO UPLOAD</p>
					  <div className="row valign-wrapper">
							<div className="file-field input-field col s10 valign">
                <div className="btn">
                  <span>File</span>
                  <input id="input" type="file" multiple/>
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                </div>
              </div>
              <div className="col s2 valign">
                <button className="btn waves-effect waves-light " type="submit" name="action">
                  <i className="mdi-content-add-box"></i> Post
                </button>
					    </div>
					  </div>
				  </form>
        </div>

        <div className="row">
          <div className="thumbs">
            {this.renderImages()}
          </div>
        </div>
      </div>
		);
	}
});

EnabledServices = React.createClass({
  getInitialState: function(){
    return {
      condition:false
    }
  },
  render(){
    return (
      <li onClick={this.choosen} className="tab col s3"><a href="" className={this.state.condition ? "choosen": ""}>{this.props.service}</a></li>
    )
  },

  choosen(event){
    event.preventDefault();
    console.log(this.state.condition);
    this.setState({condition: !this.state.condition});

  }
});

Image = React.createClass({
	propTypes: {
		image: React.PropTypes.object.isRequired
	},
  getInitialState: function(){
    return {
      condition:false
    }
  },
	render(){
    return (
			//<div className="thumbnail">
				<a href="" onClick={this.selected} className="thumbnail"><img className={this.state.condition ? "selected": ""} src={this.props.image.imageurl}/></a>
			//</div>
		);
	},

  selected(event){
    console.log(event);
    event.preventDefault();
    this.setState({condition: !this.state.condition});
    //console.log(event.target);
    //event.target.toggleClass('selected');
  }
});