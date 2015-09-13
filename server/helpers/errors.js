'use strict'

var errors = {
    400: { 
        code: 400,
        error: 'Invalide Request',
        description: 'Invalide request'
    },
    401: { 
        code: 401,
        error: 'Unauthorized',
        description: 'Access token is wrong or out of date'
    },
        
    403: { 
        code: 403,
        error: 'Forbidden',
        description: 'Forbidden' },
    404: { 
        code: 404,
        error: 'Not Found',
        description: 'Not Found' 
    },
    406: { 
        code: 406,
        error: 'Not Acceptable',
        description: 'Not Acceptable' 
    },
    410: { 
        code: 410,
        error: 'Gone',
        description: 'Gone' 
    },
    422: { 
        code: 422,
        error: 'Unprocesable Entity',
        description: 'Unprocesable Entity' 
    },
    500: { 
        code: 500,
        error: 'Internal Error',
        description: 'Internal Server Error' 
    }
};

var mongoErrors = {
    11000: {
        code: 422,
        error: 'Unprocesable Entity',
        description: 'Duplicate Key in Database'
    }
}

module.exports = function (err) {
    var _code = err.code;
    var _error = err.error;
    if (_code!=null && _error!=null) {
        return err;
    }

    if (_code > 10000 && mongoErrors[_code] != null) {
        return mongoErrors[_code];
    }
    if (errors[_code]!=null) {
        return errors[_code];
    }
    
    return errors[500];
}

