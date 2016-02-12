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
  render() {

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
          <h3 className="">SnapShare, the easiest way to share your photos!</h3>
        </div>
        <div className="row">
          <h5 className="">Without SnapShare</h5>
          <img src="before_ss.png" alt="Before Snapshare" height="275" width="530" />
        </div>
        <div className="row">
          <h5 className="">With SnapShare</h5>
          <img src="after_ss.png" alt="With Snapshare" height="275" width="442" />
        </div>
      </div>
    )
  }
});