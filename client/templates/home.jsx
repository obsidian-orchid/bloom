var uploader = new Slingshot.Upload("myFileUploads");
imageDetails = new Mongo.Collection('imageDetails');

Home = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    var userServicesData = Meteor.subscribe('userData');
    var servicesData = Meteor.subscribe('services');
    //console.log(servicesData);
    return {
      userLoading: !userServicesData.ready(),
      servicesLoading: !servicesData.ready(),
      userServices: Meteor.users.find().fetch(),
      services: Services.find().fetch(),
      images: imageDetails.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch()
    }
  },
  getInitialState: function() {
    return {
      selectedImages: {},
      selectedServices: {}
    }
  },
  renderImages(){
    return this.data.images.map((image) => {
      return <Image key={image._id} image={image} selectedImages={this.state.selectedImages} />
    });
  },
  uploadImage(event) {
    event.preventDefault();
    //console.log('test: ', document.getElementById('input').files);
    var fileUpload = document.getElementById('input').files;

    for (var i = 0; i < fileUpload.length; i++) {
      var imageLocal = "https://bloom-photos.s3-us-west-1.amazonaws.com/"+Meteor.userId()+"/"+fileUpload[i].name;
      console.log('imageLocal: ', imageLocal);
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
          //Meteor.call('postFacebook', downloadUrl);
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
    // console.log('images: ', images);
    // console.log('services: ', services);
    var state = this.state.services;
    var postService;
    //console.log(state);
    _.each(services, function(key1, service) {
      _.each(images, function(key2, image) {
        console.log(service, image);
        if(key1 === true && key2 === true){
          postService = 'post_' + service;
          // console.log('postService: ', postService, image);
          Meteor.call(postService, image, function(err, data) {
            console.log('Successful post to ' + service + ' : ' + data);
          });
        }
      })
    })
  },
  deleteImage(images, services){
    // console.log('images: ', images);
    // console.log('services: ', services);
    var state = this.state.services;
    var delService;
    //console.log(state);
    _.each(services, function(key1, service){
      _.each(images, function(key2, image){
        // console.log(service, image);
        if(key1 === true && key2 === true){
          delService = 'delete_' + service;
          // state[service].delete(image);
          console.log('deleteService: ', delService, image);
          Meteor.call(delService, image, function(err, data) {
          });
        }
      })
    })

  },
  createAlbum(services){
    var album = document.getElementById('album').value;
    document.getElementById('album').value = '';
    console.log(album, services);
    var state = this.state.services;
    var albumService;
    _.each(services, function(key1, service){
      if(key1 === true){
        albumService = 'create_'+ service;
        Meteor.call(albumService, album, function(err, data){})
      }

    });
  },
  albumsList(){
    var newServices = this.data.services;
    console.log(newServices);

  },
  activeAppList() {
    var services = this.data.services;
    var userServices = this.data.userServices[0].services;

    return _.reduce(userServices, function(acc, userService, key) {
      _.each(services, function(service) {
        if(service.name === key) {
          acc[key] = {
            'name': key,
            'state': service.state
          }
        }
      });
      return acc;
    }, {});

  },
  render(){
    if (this.data.userLoading && this.data.servicesLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }
    // console.log('activeServices: ', this.activeAppList());
    // console.log('userId: ', this.data.userServices[0]._id);
    return (
      <div className="">
        <div className="row">
          <div className="col s12">
            <EnabledServices activeAppList={this.activeAppList()} services={this.data.services} selectedServices={this.state.selectedServices} />
          </div>
        </div>
        <div className ="row">
          <div className="col s12">
            {this.albumsList()}
          </div>
        </div>
        <div className="row">
          <p className="flow-text">SELECT SERVICE YOU WANT TO ADD THE ALBUM TO AND CREATE NEW ALBUM</p>
          <input id="album" type="text" placeholder="Album Title" onSubmit={ this.createAlbum.bind(null, this.state.selectedServices) }/>
          <button className="btn waves-effect waves-light" onClick={ this.createAlbum.bind(null, this.state.selectedServices) }>Create New Album
            <i className="mdi-av-queue right"></i></button>
          <form id="upload" className="col s12">
            <p className="flow-text">CLICK HERE TO UPLOAD</p>
            <div className="row valign-wrapper">
              <div className="file-field input-field col m10 s8 valign">
                <div className="btn">
                  <span>File</span>
                  <input id="input" type="file" multiple onChange={this.uploadImage}/>
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                </div>
              </div>
              <div className="col m2 s4 valign">

              </div>
            </div>
          </form>

        </div>
        <div className="row">
          <div className="thumbs">
            {this.renderImages()}
          </div>
        </div>
        <button className="btn waves-effect waves-light" onClick={ this.postImage.bind(null, this.state.selectedImages, this.state.selectedServices) }>
          POST<i className="mdi-content-send right"></i></button>
        <button className="btn waves-effect waves-light" onClick={ this.deleteImage.bind(null, this.state.selectedImages, this.state.selectedServices) }>
          <i className="mdi-action-delete right"></i></button>
      </div>
    );
  }
});

/*Albums available for posting images*/

AlbumsAvailable = React.createClass({
  render(){
    return (
      <div>

      </div>
    )
  }
});

/*
 EnabledServices
 */
EnabledServices = React.createClass({
  getInitialState: function(){
    return {
      condition: false
    }
  },
  renderServiceList(service){
    var serviceState = this.props.activeAppList[service];
    // console.log('check: ', serviceState)
    if(serviceState) {
      return (
        <li key={service} onClick={this.chosen.bind(null, service)} className="tab col s3">
          <a href="" className={this.state.condition ? "chosen": ""}>{service}</a>
        </li>
      )
    }
  },
  chosen(service){
    //event.preventDefault();
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
  },
  render(){
    return (
      <ul className="tabs">
        {Object.keys(this.props.activeAppList).map(this.renderServiceList)}
      </ul>
    )
  }
});

/*
 Image
 */
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
      <a href="" onClick={this.selected.bind(null, this.props.image.imageurl)} className="thumbnail"><img className={this.state.condition ? "selected": ""} src={this.props.image.imageurl}/></a>
      //</div>
    );
  },

  selected(image){
    //event.preventDefault();
    this.setState({condition: !this.state.condition});
    if(this.props.selectedImages.hasOwnProperty(image)) {
      if (this.props.selectedImages[image] = true) {
        this.props.selectedImages[image] = false;
      } else {
        this.props.selectedImages[image] = true;
      }
    }
    else{
      this.props.selectedImages[image] = true;
    }
  }
  //console.log(event.target);
  //event.target.toggleClass('selected');
});


// Image = React.createClass({
//   propTypes: {
//     image: React.PropTypes.object.isRequired
//   },
//   getInitialState: function(){
//     return {
//       condition:false
//     }
//   },
//   renderImages(image){
//     return (
//       <a href="" onClick={this.selected.bind(null, this.props.image.imageurl)} className="thumbnail"><img className={this.state.condition ? "selected": ""} src={this.props.image.imageurl}/></a>
//     )
//   },
//   selected(image){
//     //event.preventDefault();
//     this.setState({condition: !this.state.condition});
//     if(this.props.selectedImages.hasOwnProperty(image)) {
//       if (this.props.selectedImages[image] = true) {
//         this.props.selectedImages[image] = false;
//       } else {
//         this.props.selectedImages[image] = true;
//       }
//     }
//     else{
//       this.props.selectedImages[image] = true;
//     }
//   },
//   render(){
//     return (
//       {this.data.images.map(this.renderImages)}
//     );
//   }
// });