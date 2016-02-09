Package.describe({
  summary: "OAuth for SnapShare",
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.use('underscore', ['server']);
  api.use('accounts-base', ['client', 'server']);
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  api.use('http', ['client', 'server']);
  api.use('templating', 'client');
  api.use('oauth1', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('random', 'client');
  // api.use('underscore', 'server');
  api.use('service-configuration', ['client', 'server']);

  api.export('OAuth_SS');

  api.addFiles('oauth_ss_server.js', 'server');
  api.addFiles('oauth_ss_client.js', 'client');
});