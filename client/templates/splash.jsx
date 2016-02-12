Splash = React.createClass({
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
      imagesPerService: {},
      cameraImages: {}
    }
  },
  activeAppList() {
    var services = this.data.services;
    var userServices = this.data.userServices[0].services;
    var list = [];

    for(service in userServices){
      if(userServices[service].state === true){
        var newServ = {
          'name': service,
          'state': true
        };
        list.push(newServ);
      }
    }

    return list;
  },
  renderServices(){
    return this.activeAppList().map((service) =>{
      return <p key={service.name}>{service.name} </p>
    })
  },
  renderImages(){
    var currentServices = this.activeAppList();
    return this.data.images.map((image) => {
      return <Image onChange={this.addImageToService.bind(null, image)} key={image._id} currentServices={currentServices} image={image} selectedImages={this.state.selectedImages} />
    });
  },
  addImageToService(image, services){
    for (key in services){
      var store = this.state.imagesPerService[key] || {};
      store[image._id] = image;
      this.state.imagesPerService[key] = store;
      console.log('Image added to ' + key);
    }
    // console.log(this.state.imagesPerService);
  },
  uploadImagePerService(){
    for(service in this.state.imagesPerService){
      for(image in this.state.imagesPerService[service]){
        postService = 'post_' + service;
        Meteor.call(postService, this.state.imagesPerService[service][image].imageurl, function(err, data) {
          console.log('Successful post to facebook');
          // console.log('Successful post to ' + service + ' : ' + data, err);
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
    var fileUpload = document.getElementById('input').files;
    for (var i = 0; i < fileUpload.length; i++) {
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

      var uploader = new Slingshot.Upload("myFileUploads");
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
  libraryEvent(){
    //console.log('phoneLibrary');
    if (Meteor.isCordova) {
      MeteorCamera.getPicture({
        width: 350,
        height: 350,
        quality: 75,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI
      }, function (err, data) {
        if (err) {
          console.log('Error taking images', error);
        }
        //console.log(data);
        Session.set('photo', data);
        Meteor.call('cameraPhonePhoto', data, function(err, result){});
      });
    }
    else{
      alert('Cordova only feature');
    }
  },
  render() {

    if (this.data.userLoading && this.data.servicesLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }

          //<div className="col l10 offset-l1 m10 offset-m1 s12">
    return (
      <div className="">
        <div className="row">
          <div className="card">
            <div className="card-content">
              Active services: {this.renderServices()}
            </div>
          </div>
        </div>
        <div className="row thumbs">
            <div className="card image-container">
              <div className="card-content">
                pictures
                <div className="fixed-action-btn click-to-toggle" style={{position: "absolute", display:"inline-block"}}>
                  <a className="btn-floating btn-large red">
                    <i className="large mdi-content-add"></i>
                  </a>
                  <ul>
                    <li><a className="btn-floating red">
                    <i className="large mdi-image-camera-alt"></i></a></li>
                    <li><a className="btn-floating yellow darken-1">
                    <i className="large mdi-device-devices"></i></a></li>
                  </ul>
                </div>
                <input type="button" className="btn capture" value="Take Photo" onClick={this.takePhoto} />
              < takePhoto />< libraryEvent />
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
              </div>
            </div>

              {this.renderImages()}
        </div>
      </div>
    )
  },
  submitForm(event){
    event.preventDefault();
    $('.thumbs').append(<div/>, { text: "hi"

    });
    console.log("submitted");
  }
});


            //{_.isEmpty(this.data.images) ? (
            //) :
            //}