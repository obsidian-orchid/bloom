imageDetails = new Mongo.Collection('imageDetails');

//For camera
const takePhoto = BlazeToReact('takePhoto');

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
      selectedServices: {},
      imagesPerService: {
        'tumblr': {},
        'facebook': {},
        'pinterest': {}
      },
      cameraImages: {}
    }
  },
  renderImages(){
    return this.data.images.map((image) => {
      return <Image onChange={this.addImageToService.bind(null, image)} key={image._id} image={image} selectedImages={this.state.selectedImages} />
    });
  },
  addImageToService(image, services){
    for (key in services){
      var store = this.state.imagesPerService[key] || {};
      store[image._id] = image;
      this.state.imagesPerService[key] = store;
    }
    console.log(this.state.imagesPerService);
  },
  uploadImagePerService(){
    for(service in this.state.imagesPerService){
      for(image in this.state.imagesPerService[service]){
        postService = 'post_' + service;
        Meteor.call(postService, this.state.imagesPerService[service][image].imageurl, function(err, data) {
          console.log('Successful post to ' + service + ' : ' + data, err);
        });
      }
    }
  },
  removePerService(images, services){
    for(service in this.state.imagesPerService){
      for(image in this.state.imagesPerService[service]){
        delService = 'delete_' + service;

        Meteor.call(delService, this.state.imagesPerService[service][image].imageurl, function(err, data) {
          console.log('Successful delete from ' + service + ' : ' + data, err);
        });
      }
    }
  },
  uploadImage(event) {
    event.preventDefault();
    //console.log('test: ', document.getElementById('input').files);
    var fileUpload = document.getElementById('input').files;

    for (var i = 0; i < fileUpload.length; i++) {
      //var imageLocal = "https://bloom-photos.s3-us-west-1.amazonaws.com/"+Meteor.userId()+"/"+fileUpload[i].name;
      //console.log('imageLocal: ', imageLocal);
      //imageDetails._collection.insert({
      //  imageurl: imageLocal,
      //  time: new Date()
      //});

      //console.log(fileUpload[i]);
      //if (fileUpload[i] == null)
      //{
      //  continue;
      //}
      var uploader = new Slingshot.Upload("myFileUploads");
      uploader.send(fileUpload[i], function (error, downloadUrl) {
        console.log('file: ', downloadUrl);
        if (error)
        {
          console.error('Error uploading', error,  uploader.xhr.response);
        }
        else
        {
          imageDetails._collection.insert({
            imageurl: downloadUrl,
            time: new Date()
          });
        }
      });
    }
    function allFilesUploaded (url) {
      Meteor.users.update(Meteor.userId(), {$push: {"profile.files": url}});
    }
  },
  //postImage(images, services) {
  //  // console.log('images: ', images);
  //  // console.log('services: ', services);
  //  var state = this.state.services;
  //  var postService;
  //  //console.log(state);
  //  _.each(services, function(key1, service) {
  //    _.each(images, function(key2, image) {
  //      console.log(service, image);
  //      if(key1 === true && key2 === true){
  //        postService = 'post_' + service;
  //        // console.log('postService: ', postService, image);
  //        Meteor.call(postService, image, function(err, data) {
  //          console.log('Successful post to ' + service + ' : ' + data);
  //        });
  //      }
  //    })
  //  })
  //},
  //deleteImage(images, services){
  //  // console.log('images: ', images);
  //  // console.log('services: ', services);
  //  var state = this.state.services;
  //  var delService;
  //  //console.log(state);
  //  _.each(services, function(key1, service){
  //    _.each(images, function(key2, image){
  //      // console.log(service, image);
  //      if(key1 === true && key2 === true){
  //        delService = 'delete_' + service;
  //        // state[service].delete(image);
  //        //console.log('deleteService: ', delService, image);
  //        Meteor.call(delService, image, function(err, data) {
  //        });
  //      }
  //    })
  //  })
  //
  //},
  //There is a limit to the number of albums that can be created in 24 hours
  //Add alert if the album limit exeeds
  createAlbum(services){
    var album = document.getElementById('album').value;
    document.getElementById('album').value = '';
    //console.log(album, services);
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
    //console.log(newServices);
    _.each(newServices, function(key1,service) {
      //console.log(key1.album);
      return key1.album.map((album) => {
        return <AlbumsAvailable key={album._id} album={album}/>
      });
    })

  },
  takePhoto(){

    console.log('Starting camera service');
    //console.log(this.state.cameraImages);
    //console.log(this.state);
    MeteorCamera.getPicture({
      width: 350,
      height: 350,
      quality: 75 }, function(err, data){
      if(err){
        console.log('Error taking images', error);
      }
      //console.log(data);
      Session.set('photo', data);
      //var image = document.getElementById ('picture');
      //image.src = data;
      var contentType = 'image/png';
      var b64Data = data.slice(23);
      var blob = b64toBlob(b64Data, contentType);
      function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);
          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
      uploader.send(blob, function (error, downloadUrl) {
        if (error)
        {
          console.error('Error uploading', uploader.xhr.response);
        }
        else
        {
          console.log(downloadUrl);
          imageDetails._collection.insert({
            imageurl: downloadUrl,
            time: new Date()
          });
        }
      });
    });
  },
  //libraryEvent(){
  //  //console.log('phoneLibrary');
  //  if (Meteor.isCordova) {
  //    MeteorCamera.getPicture({
  //      width: 350,
  //      height: 350,
  //      quality: 75,
  //      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
  //      destinationType: Camera.DestinationType.FILE_URI
  //    }, function (err, data) {
  //      if (err) {
  //        console.log('Error taking images', error);
  //      }
  //      //console.log(data);
  //      Session.set('photo', data);
  //      Meteor.call('cameraPhonePhoto', data, function(err, result){});
  //    });
  //  }
  //  else{
  //    alert('Cordova only feature');
  //  }
  //},
  render(){
    if (this.data.userLoading && this.data.servicesLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }
    return (
      <div className="">
        <div className="row">
          <form id="upload" className="col s12">
            <p className="flow-text">CLICK HERE TO UPLOAD</p>
            <div className="row valign-wrapper">
              <input type="button" className="btn capture" value="Take Photo" onClick={this.takePhoto} />
              < takePhoto />< libraryEvent />
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

        <button className="btn waves-effect waves-light" onClick={ this.uploadImagePerService}>
          UPLOAD<i className="mdi-content-send right"></i>
        </button>
        <button className="btn waves-effect waves-light" onClick={ this.removePerService}>
          UNDO<i className="mdi-action-delete right"></i>
        </button>
        <p></p>
      </div>


      //ALBUM STUFF REMOVED FOR NOW
      //
      //  <div className ="row">
      //    <div className="col s12">
      //      {this.albumsList()}
      //    </div>
      //    <p className="flow-text">SELECT SERVICE YOU WANT TO ADD THE ALBUM TO AND CREATE NEW ALBUM</p>
      //    <input id="album" type="text" placeholder="Album Title" onSubmit={ this.createAlbum.bind(null, this.state.selectedServices) }/>
      //    <button className="btn waves-effect waves-light" onClick={ this.createAlbum.bind(null, this.state.selectedServices) }>Create New Album
      //      <i className="mdi-av-queue right"></i></button>
      //  </div>


    );
  }
});

/*Albums available for posting images*/
AlbumsAvailable = React.createClass({
  getInitialState: function(){
    return {
      condition:false
    }
  },
  render(){
    //console.log(this.props.album);
    return (
      <li className="tab col s3">{this.props.album.albumTitle}</li>
    )
  }
});