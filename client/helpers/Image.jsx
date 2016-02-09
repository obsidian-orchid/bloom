
/*
  Class to handle individual images within the main home page
 */
Image = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    var userServicesData = Meteor.subscribe('userData');
    var servicesData = Meteor.subscribe('services');
    return {
      userServices: Meteor.users.find().fetch(),
      services: Services.find({state: true}).fetch()
    }
  },
  propTypes: {
    image: React.PropTypes.object.isRequired
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
  getInitialState: function(){
    return {
      condition:false,
      selectedServices: {}
    }
  },
  handleServiceSelect(service){
    var slot = this.state.selectedServices[service.name];

    //removing services we don't enable
    if(slot){
      delete this.state.selectedServices[service.name];
    }
    else{
      this.state.selectedServices[service.name] = true;
    }

    //passing which service is selected for which image to parent
    this.props.onChange(this.state.selectedServices);
  },
  //rendering services that are available
  renderServices(){
    return this.activeAppList().map((service) =>{
      return <ImageServices onClick={this.handleServiceSelect.bind(null, service)} key={service.name} serviceName={service.name}/>
    })
  },
  //rendering our actual image inside a card
  render(){
    return (
      <div className="card image-container">
        <div className="card-image waves-effect waves-block waves-light">
          <img className="upload-image" src={this.props.image.imageurl}/>
        </div>

        <div className="card-action">
          <input placeholder="Caption"  type="text"/>
          {this.renderServices()}
        </div>
      </div>
    );
  }
});

/*
  Class to handle individual services for each image
 */
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
  //toggles selection attribute on each image service
  toggleSelect(){
    this.setState({
      showActive: !this.state.showActive
    });
    this.props.onClick();
  }

});