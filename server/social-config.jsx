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

//ServiceConfiguration.configurations.insert({
//    "service": "imgur",
//    "clientId": "e808bd261a2d336",
//    "secret": "29d12ca3d2c67f7fcc46428375ff255d9b7c3e01"
//});


//ServiceConfiguration.configurations.insert({
//    "service": "google",
//    "clientId": "89929469817-2ndstqi3uvf7b95eru0js148ntliq28k.apps.googleusercontent.com",
//    "secret": "KxM_Pk086CxAjt6ZWnCJscJn"
//});