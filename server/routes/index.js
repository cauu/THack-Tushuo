'use strict'

var express = require('express');
var router = express.Router();
var oauth = require('../middlewares/auth');

var route = function (app) {
    app.use('/api/v1', router);

    //允许跨域请求
    router.use(function(req, res, next) {
         res.header("Access-Control-Allow-Origin", "*");
         res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, If-Modified-Since");
         next();
    });

    router.use('/user', require('./user'));
}

module.exports = route;
