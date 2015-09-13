'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String, require: true },
    is_super_admin: { type: Boolean, default: false },  
    created_at: { type: Date, default: Date.now }, 
    gender: { type: Number, default: 0 },
    selfie: { type: String, default: '' }
});

var UserModel = mongoose.model('Users', UserSchema);

var getByNameAndPassword = function (username, password, cb) {
    UserModel.findOne({ username: username, password: password }, 
                      function(err, result) {
                          if(err) return cb(err);
                          if(!result) cb(null, null);
                          cb(null, result);
                      });
}

var create = function (username, password, cb) {
    UserModel.create({
        'username': username,
        'password':password
    }, function (err, result){
            if (err) return cb(err);
            cb(null, result);
    });
}

var changePassword = function (username, password, cb) {
    var condition = { 'username': username};
    var update = {$set: { 'password': password} };
    var options = {};
    UserModel.update(condition, update, options, function (err) {
       if (err) return cb(err); 
       cb(null);
    });
}

exports.getByNameAndPassword = getByNameAndPassword;
exports.create = create;
exports.changePassword = changePassword;

