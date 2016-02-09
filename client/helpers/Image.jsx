
/*
 Image
 */
Image = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    var userServicesData = Meteor.subscribe('userData');
    var servicesData = Meteor.subscribe('services');
    console.log(Meteor.users.find().fetch());
    return {
      userServices: Meteor.users.find().fetch(),
      services: Services.find({state: true}).fetch()
    }
  },
  propTypes: {
    image: React.PropTypes.object.isRequired
  },
  getInitialState: function(){
    return {
      condition:false,
      selectedServices: {}
    }
  },
  renderServices(){
    return this.data.services.map((service) =>{
      return <ImageServices key={service._id} serviceName={service.name}/>
    })
  },
  render(){
    return (
      //<div className="thumbnail">
      //<a href="" onClick={this.selected.bind(null, this.props.image.imageurl)} className="thumbnail"><img className={this.state.condition ? "selected": ""} src={this.props.image.imageurl}/></a>
      //</div>
      <div className="card image-container">
        <div className="card-image waves-effect waves-block waves-light">
          <img className="" src={this.props.image.imageurl}/>
        </div>

        <div className="card-action">
          <input placeholder="Caption"  type="text"/>
          {this.renderServices()}
        </div>
      </div>
    );
  },
  toggleService(event){
    console.log(event);
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

ImageServices = React.createClass({
  propTypes: {
    serviceName: React.PropTypes.string.isRequired
  },
  getInitialState(){
    return {
      showActive: false
    }
  },
  render(){
    return (
      <img onClick={this.toggleSelect} className={this.state.showActive ? "service-icon" : "service-icon inactive"} src={'services/' + this.props.serviceName + '.png'}/>
    )
  },
  toggleSelect(){
    console.log("clicked");
    this.setState({
      showActive: !this.state.showActive
    })
  }

});