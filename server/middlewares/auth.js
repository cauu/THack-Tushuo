'use strict'

var oauthserver = require('oauth2-server');

module.exports = oauthserver({
    model: require('../models/auth'),
    grants: ['password'],
    debug: true
});


