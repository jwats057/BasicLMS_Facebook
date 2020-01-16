module.exports = {
	responseStatus: {
		success: 'success',
		failure: 'failure'
	},
    httpStatusCode: {
        success: 200,
        errorOnRequest: 400,
        unauthorized: 401,
        dataNotInDB: 402,
        resourceNotFound: 404,
        forbidden: 403,
        conflict: 409,
        executionException: 500
    }
};