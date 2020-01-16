#!/usr/bin/env node
const app = require('./app/app');
// const http = require('http');
const https = require('https');
const http = require('http');

const fileStream = require('fs');

const portNorm = val => {
    let port = parseInt(val, 10);
    if(isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const onError = error => {
	console.log('ERROR HERE');
	if (error.syscall !== 'listen') {
		throw error;
    }
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const onListening = () => {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
	console.warn('Listening on ' + bind);
};

const port = portNorm(process.env.PORT || '3001');
app.set('port', port);


// const server = https.createServer({
// 	key: fileStream.readFileSync('server.key'),
// 	cert: fileStream.readFileSync('server.crt'),
// 	ca: fileStream.readFileSync('selfCA.crt'),
// },app);

// const server = http.createServer(app);

let tempServer;
if(process.env.NODE_ENV == 'dev') {
	console.log('we are running dev environment');
	tempServer = https.createServer({
		key: fileStream.readFileSync('server.key'),
		cert: fileStream.readFileSync('server.crt'),
		ca: fileStream.readFileSync('selfCA.crt'),
	},app);
} else {
	tempServer = https.createServer({
		key: fileStream.readFileSync('home/master/myagent/fb_backend/server.key'),
		cert: fileStream.readFileSync('home/master/myagent/fb_backend/server.crt'),
	},app);
	console.log('we are running production environment');
}
const server = tempServer;

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
