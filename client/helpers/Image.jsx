
/*
 Image
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

    //console.log(userServices);

    for(service in userServices){
      console.log(userServices[service]);
      if(userServices[service].state === true){
        var newServ = {
          'name': service,
          'state': true
        }
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
  handleServiceSelect(service, event){
    var slot = this.state.selectedServices[service.name];
    if(slot){
      delete this.state.selectedServices[service.name];
    }
    else{
      this.state.selectedServices[service.name] = true;
    }
    this.props.onChange(this.state.selectedServices);
  },
  renderServices(){
    console.log(this.activeAppList(), this.data.services);
    var objs = this.activeAppList();
    return objs.map((service) =>{
      return <ImageServices onClick={this.handleServiceSelect.bind(null, service)} key={service.name} serviceName={service.name}/>
    })
  },
  render(){
    return (
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
  }
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
    this.setState({
      showActive: !this.state.showActive
    });
    this.props.onClick();
  }

});