Splash = React.createClass({
  render() {
    return (
      <div className="">
        <div className="row">
          <form id="upload" className="col s12" onSubmit={this.submitForm}>
            <p className="flow-text">CLICK HERE TO UPLOAD</p>
            <div className="row valign-wrapper">
              <div className="file-field input-field col m10 s8 valign">
                <div className="btn">
                  <span>File</span>
                  <input id="input" type="file" multiple/>
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                </div>
              </div>
              <div className="col m2 s4 valign">
                <input type="submit"/>
              </div>
            </div>
          </form>
        </div>
        <div className="row">
          <div className="thumbs">
          </div>
        </div>
        <p></p>
      </div>
    )
  },
  submitForm(event){
    event.preventDefault();
    console.log("submitted");
  }
});

MeteorFile = function(options){

};

MeteorFile.prototype = {
  constructor: MeteorFile,
  read: function(file, callback){

  },
}