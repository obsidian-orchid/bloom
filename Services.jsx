/**
 * Created by siobhan on 2016/01/22.
 */
Service = React.createClass({
  propTypes: {
    service: React.PropTypes.object.isRequired
  },

  deleteService(event){
    event.preventDefault();
    Services.remove(this.props.service._id);
  },

  render(){
    return (
      <li>
        <span>{this.props.service.name}</span>
        <a href="" className="delete" onClick={this.deleteService}> &times;</a>
      </li>
    );
  }
});