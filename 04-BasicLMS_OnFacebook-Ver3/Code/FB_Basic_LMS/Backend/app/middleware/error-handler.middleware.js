module.exports = (err, req, res, next) => {
    const commDictionary = require('../utils/http-codes.dictionary');
    const boom = require('boom');
    if (!err.status) {
        err.status = 500;
    }
    if (err.status === commDictionary.httpStatusCode.errorOnRequest) {
        let errorRequest = boom.badRequest('Some information is missing in the request');
        res.status(commDictionary.httpStatusCode.errorOnRequest).json(errorRequest.output.payload);
    } else {
        console.log(err);
        let errorInternal = boom.internal('Internal Server Error');
        res.status(commDictionary.httpStatusCode.executionException).json(errorInternal.output.payload);
    }
};
