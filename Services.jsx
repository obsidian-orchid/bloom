/**
 * Created by siobhan on 2016/01/22.
 */
Service = React.createClass({
  propTypes: {
    service: React.PropTypes.object.isRequired
  },

  render(){
    return (
      <li>{this.props.service.name}</li>
    );
  }
})