// configs/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth': {
        'clientID': '292060075581-3qa6t5l4uvghv8f0htq9i0674k18sjer.apps.googleusercontent.com',
        'clientSecret': 'PTukBOht2TQ8aECH67Z7rlw4',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
        
    }

};
/*
'localCallbackURL': 'http://localhost:8080/auth/google/callback',
'remoteCallbackURL': 'https://stevef.herokuapp.com/auth/google/callback'
*/