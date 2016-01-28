/**
 * Created by siobhan on 2016/01/25.
 */
var smtp = {
  username: 'team@sandboxb54ee96179c948f2a4651270a9bc22ad.mailgun.org',   // eg: server@gentlenode.com
  password: '2UgWkXjnvn2ygnuSTfquYE435k1KLSoM',   // eg: 3eeP1gtizk5eziohfervU
  server:   'smtp.mailgun.org',  // eg: mail.gandi.net
  port: 465
};

//email
process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
