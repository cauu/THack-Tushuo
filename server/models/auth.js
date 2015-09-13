'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = require('./user');

var OAuthAccessTokensSchema = new Schema({
    accessToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

var OAuthRefreshTokenSchema = new Schema({
    refreshToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

var OAuthClientsSchema = new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUri: { type: String }
});

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens',
                                            OAuthAccessTokensSchema);
var OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens',
                                             OAuthRefreshTokenSchema);
var OAuthClientsModel = mongoose.model('OAuthClients',
                                       OAuthClientsSchema);

var getAccessToken = function (bearerToken, cb) {
    console.log('in getAccessToken (bearerToken:' + bearerToken + ')');

    OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, cb);
}

var createClient = function (clientId, clientSecret, cb) {

}

var getClient = function (clientId, clientSecret, cb) {
    console.log('in getClient (clientId:' + clientId + ', clientSecret: ' + clientSecret + ')');

    if (clientSecret === null) {
        return OAuthClientsModel.findOne({ clientId: clientId }, cb);
    }
    OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }, cb);
}

var saveAccessToken = function (token, clientId, expires, userId, cb) {
    var accessToken = new OAuthAccessTokensModel({
        accessToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    accessToken.save(cb);
}

//get authorized client ids from oauthclients
var authorizedClientIds = ['iutravel','123','222'];

var grantTypeAllowed = function (clientId, grantType, cb) {
    OAuthClientsModel.findOne({ clientId: clientId }, function (err, result) {
        if (err) {
            cb(err);
        }
        if (grantType === 'password') {
            //return cb(false, authorizedClientIds.indexOf(clientId) >= 0);
            return cb(false, result!==null);
        }

        cb(false, true);
    });
}

var saveRefreshToken = function (token, clientId, expires, userId, cb) {
    console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId +', userId: ' + userId + ', expires: ' + expires + ')');

    var refreshToken = new OAuthRefreshTokensModel({
        refreshToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    refreshToken.save(cb);
}

var getRefreshToken = function (refreshToken, cb) {
    console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

    OAuthRefreshTokensModel.findOne({ refreshToken: refreshToken }, cb);
}

//Call get user from user model
var getUser = function (username, password, cb) {
    console.log('in getUser (username: ' + username+ ', password: ' + password + ')');

    user.getByNameAndPassword(username, password, 
                      function(err, user) {
                          if(err) return cb(err);
                          cb(null, user._id);
                      });
}

exports.getUser = getUser;
exports.getAccessToken = getAccessToken;
exports.getClient = getClient;
exports.grantTypeAllowed = grantTypeAllowed;
exports.saveAccessToken = saveAccessToken;
exports.saveRefreshToken = saveRefreshToken;
exports.getRefreshToken = getRefreshToken;
