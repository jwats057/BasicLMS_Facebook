const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var passport = require('passport');
const d = require('./passport.strategy');
const database = require('firebase-admin').database();

module.exports = (passport) => {

    router.get('/foo', async (req, res, next) => {
        res.json('foo');
    })

    var createToken = function(auth) {
        console.log("AUTH : ");
        console.log(auth);
        return jwt.sign({
                id: auth.id
            }, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx',
            {
                expiresIn: 60 * 120
            });
    };

    router.post('/auth/facebook', (req, res, next) => {
            console.log("HERE I AM AUTH FACEBOOK");
            var userID = req.body.params.updates[0].value;
            console.log(userID);
            const token = jwt.sign(userID, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx');
            console.log('TOKEN = ' + token);
        if (!userID) {
                return res.send(401, 'UserModel Not Authenticated');
            }
            // prepare token for API
        res.status(200).send({
             user: userID,
            token: token
        });
    });

    router.get('/auth/me', passport.authenticate('jwt', {session:true}), async (req, res, next) => {
        console.log('IN AUTHME');
        var users = await database.ref('/users').orderByKey().equalTo(req.user).once('value');
        if(users.val()) {
            let userinfo = users.val()[req.user];
            let userHeader = {
                id: req.user,
                registered: true
            };
            let resp = Object.assign(userHeader, userinfo);
            console.log('#################' + JSON.stringify(resp));
            res.json(resp);
        } else {
            console.log('AUTH/ME CANNOT GET USERS');
            res.json({
                userID: req.user,
                registered: false
            });
        }
    });
    // router.get('/auth/me', passport.authenticate('jwt', {session:true}), async (req, res, next) => {
    //     console.log('IN AUTHME');
    //     console.log(req.user);
    //     var users = await database.ref('/users').orderByKey().equalTo(req.user).once('value');
    //     if(users) {
    //         let userinfo = users.val()[req.user];
    //         let userHeader = { id: req.user };
    //         let resp = Object.assign(userHeader, userinfo);
    //         res.json(resp);
    //     } else {
    //         console.log('AUTH/ME CANNOT GET USERS');
    //         res.json({userID: req.user});
    //     }
    // });
    return router;
}

