
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
  handleServiceSelect(service, event){
    var val = this.state.selectedServices[service.name] || false;
    this.state.selectedServices[service.name] = !val;
    console.log(this.state.selectedServices);
  },
  renderServices(){
    return this.data.services.map((service) =>{
      return <ImageServices onClick={this.handleServiceSelect.bind(null, service)} key={service._id} serviceName={service.name}/>
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