ServiceConfiguration.configurations.remove({
    $or: [ {service: "facebook"}, {service: "twitter"}, {service: "google"} ]
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1538811913098172',
    secret: '09440da7720f33c4d05bb58b8d67fd45'
});

ServiceConfiguration.configurations.insert({
    "service": "google",
    "clientId": "89929469817-njrdulgdgpvtteo9sqqg6as9mo3e07e0.apps.googleusercontent.com",
    "secret": "LZ6oa4TIS81EfXZsVMSkVjHg"
});