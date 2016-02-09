OAuth_SS = {};

OAuth_SS.authorizeWindow = function(url) {
  var left = (screen.width/2)-(400/2);
  var top = (screen.height/2)-(400/2);
  window.open(url, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=400, height= 400, top='+top+', left='+left);
}