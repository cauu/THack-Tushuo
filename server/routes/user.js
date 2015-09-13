var express = require('express');
var router = express.Router();

var user = require('../models/user');
var oauth = require('../middlewares/auth');
var errorHandler = require('../middlewares/err_handler');

//add middlewares here 
//eg. router.use('/', require('../middlewares/auth.js'));

router.post('/register', function (req, res, next) {
    user.create(req.body.username, 
        req.body.password, 
        function (err, user) {
            if (err) {
              //TODO: return err
              next(err);
            }
            else {
              res.json(user);
            }
        });
}, errorHandler);

router.all('/login', oauth.grant(), errorHandler);

module.exports = router;
