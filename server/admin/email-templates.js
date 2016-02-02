/**
 * Created by siobhan on 2016/01/28.
 */
//all emails
Accounts.emailTemplates.siteName = 'SNAPSHARE';
Accounts.emailTemplates.from = 'SNAPSHARE \<obsidian.orchid.bloom@gmail.com>';

//verifying account
Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return '[SNAPSHARE] Verify email address for ' + user.profile.firstName + ' ' + user.profile.lastName;
};
Accounts.emailTemplates.verifyEmail.text = function(user, url){
  var address = user.emails[0].address;
  var url = url.replace('#/', '');
  var from = 'obsidian.orchid.bloom@gmail.com';
  var body = 'Thank you for registering an account with SNAPSHARE! Please click the' +
    ' following link to verify your email address and unlock your account:\n' +
    url + '\n\nIf you we have made a mistake, please contact our team at ' +
    from;
  return body;
};

//resetting account password
Accounts.emailTemplates.resetPassword.subject = function(user) {
  return '[SNAPSHARE] Reset password request by ' + user.profile.firstName + ' ' + user.profile.lastName;
};
Accounts.emailTemplates.resetPassword.text = function(user, url){
  var address = user.emails[0].address;
  var url = url.replace('#/', '');
  var from = 'obsidian.orchid.bloom@gmail.com';
  var body = 'You requested a password reset for your SNAPSHARE account. To complete' +
    ' your request please visit the following link:\n' + url + '\n\nIf you did not' +
    ' request this reset, please ignore this email. If you feel someone is trying' +
    ' to access your account without your permission please contact our team at ' +
    from;
  return body;
};