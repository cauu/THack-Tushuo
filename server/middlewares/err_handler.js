var errors = require('../helpers/errors');

module.exports = function (err, req, res, next) {
    if (err !=null ) {
       res.json(errors(err)); 
    }
    next();
}
