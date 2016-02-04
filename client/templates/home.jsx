var uploader = new Slingshot.Upload("myFileUploads");
imageDetails = new Mongo.Collection('imageDetails');
Home = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      images: imageDetails.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch(),
      currentUser: Meteor.user()
    };
  },
  getInitialState: function() {
    // console.log('user: ', this.data.currentUser);
    return {
      selectedImages: {},
      selectedServices: {
        'testService': false
      },
      services: {
        google: {
          name: 'Google',
          post: function() {

          }
        },
        facebook: {
          name: 'Facebook',
          post: function(imageURL) {
            Meteor.call('postFBPhoto', imageURL, function(err, data) {});
          }
        },
        imgur: {
          name: 'Imgur',
          post: function(imageURL) {
            Meteor.call('postImgur', imageURL, function(err, data) {});
          }
        }
      }
    }
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
        return <EnabledServices key={service} service={service} selectedServices={this.state.selectedServices} />;
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
  postImage(images, services) {
    // console.log('postImage: ', images, services);
    var state = this.state.services;
    _.each(services, function(service) {
      _.each(images, function(image) {
        console.log(service, image);
        state[service].post(image);
      })
    })
  },
  render(){
    var testImages = ['http://i.imgur.com/EPtcLTy.jpg', 'http://i.imgur.com/llWihVz.jpg'];
    // var testServices = this.getActiveServices();
    var testServices = ["facebook", "imgur"];
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
          <button className="btn waves-effect waves-light" onClick={ this.postImage.bind(null, testImages, testServices) }>POST
            <i className="mdi-content-send right"></i></button>
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
//{function() { f1(); f2(); }}
  render(){
    return (
      //<li onClick={this.choosen, this.selectService.bind(null, this.props.service)} className="tab col s3"><a href="" className={this.state.condition ? "choosen": ""}>{this.props.service}</a></li>
      <li onClick={this.chosen.bind(null, this.props.service)} className="tab col s3"><a href="" className={this.state.condition ? "chosen": ""}>{this.props.service}</a></li>
    )
  },

  //selectService(service) {
  //  console.log('hey: ', this.props.selectedServices);
  //  if(this.props.selectedServices.hasOwnProperty(service)) {
  //    if(this.props.selectedServices[service] = true) {
  //      this.props.selectedServices[service] = false;
  //    } else {
  //      this.props.selectedServices[service] = true;
  //    }
  //    console.log('boom: ', this.props.selectedServices[service]);
  //  }
  //},

  chosen(service){
    //event.preventDefault();
    console.log(service);
    console.log('hey: ', this.props.selectedServices);
    this.setState({condition: !this.state.condition});
    if(this.props.selectedServices.hasOwnProperty(service)) {
      if (this.props.selectedServices[service] = true) {
        this.props.selectedServices[service] = false;
      } else {
        this.props.selectedServices[service] = true;
      }
    }
    else{
      this.props.selectedServices[service] = true;
    }
    console.log('boom: ', this.props.selectedServices);
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