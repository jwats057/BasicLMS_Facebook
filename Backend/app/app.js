const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const errorHandler = require('./middleware/error-handler.middleware');
const firebase = require('firebase-admin');
const firebaseAccountConfig = require('../learnfiu_db.json');
firebase.initializeApp({
	credential: firebase.credential.cert(firebaseAccountConfig),
	databaseURL: 'https://lms-senior-project.firebaseio.com/'
});

const passport = require('passport');
require('./security/passport.strategy')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});

//------ Routes -------//
const utilsRoutes = require('./utils/utils.router')(passport);
app.use('/utils', utilsRoutes);

const coursesRoutes = require('./courses/courses.router')(passport);
app.use('/courses', coursesRoutes);

const usersRoutes = require('./users/users.router')(passport);
app.use('/users', usersRoutes);

const securityRoutes = require('./security/security.router')(passport);
app.use('/security', securityRoutes);

//------- End --------//

app.use(errorHandler);

module.exports = app;
